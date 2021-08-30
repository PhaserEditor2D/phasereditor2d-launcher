import http from "https"
import { createWriteStream, existsSync, fstat, mkdirSync, readFileSync, unlink } from "fs"
import { homedir } from "os"
import path, { dirname } from "path"
import AdmZip from "adm-zip"
import { fileURLToPath } from "url"
import { Presets, SingleBar } from "cli-progress"

function download(url, dest) {

    console.log(`Fetching ${url}`)

    return new Promise((resolve, reject) => {

        const bar = new SingleBar({ format: "{bar} {percentage}%" }, Presets.shades_classic)

        var file = createWriteStream(dest);

        try {

            http.get(url, function (response) {

                const { statusCode } = response

                if (statusCode !== 200) {

                    throw new Error("Network error downloading " + url)
                }

                const totalBytes = Number.parseInt(response.headers['content-length']);
                
                bar.start(totalBytes, 0)

                let receivedBytes = 0

                response.on("data", chunk => {

                    receivedBytes += chunk.length
                    bar.update(receivedBytes)
                })

                    .pipe(file)

                    .on("error", () => {

                        bar.stop()
                        unlink(file)

                        throw new Error("Cannot write to file")
                    })

                file.on("finish", function () {

                    bar.stop()
                    resolve()

                }).on("error", () => {

                    bar.stop()
                    unlink(file)

                    throw new Error("Cannot write to file")
                })
            });

        } catch (e) {

            reject(e)
        }
    })
}

export async function installEditor() {

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)

    const config = JSON.parse(readFileSync(path.join(__dirname, "package.json")))

    const ver = config.version

    // compute metadata

    const platform = {
        "darwin": "macos",
        "linux": "linux",
        "win32": "windows"
    }[process.platform]

    const distName = `PhaserEditor2D-core-${ver}-${platform}`
    const fileName = `${distName}.zip`

    // create install dir

    const home = homedir()

    const installsDir = path.join(home, ".phasereditor2d", "installs")
    const distInstallDir = path.join(installsDir, distName)
    const execFile = path.join(distInstallDir, "PhaserEditor2D",
        `PhaserEditor2D${platform === "windows" ? ".exe" : ""}`)

    if (existsSync(execFile)) {

        return execFile
    }

    console.log(`# Installing Phaser Editor 2D v${ver}`)
    console.log();

    mkdirSync(installsDir, { recursive: true })

    // download

    const outputFile = path.join(installsDir, fileName)

    const updatesUrl = "https://updates.phasereditor2d.com"
    const fileUrl = `${updatesUrl}/v${ver}/PhaserEditor2D-core-${ver}-${platform}.zip`

    await download(fileUrl, outputFile)

    // unzip

    console.log();
    console.log(`Unzipping ${outputFile}...`)

    mkdirSync(distInstallDir, { recursive: true })

    const zip = new AdmZip(outputFile)

    zip.extractAllTo(distInstallDir, true)

    // TODO check md5sum

    return execFile
}