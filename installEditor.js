import http from "https"
import { chmodSync, createWriteStream, existsSync, fstat, mkdirSync, readFileSync, unlink } from "fs"
import { homedir } from "os"
import path, { dirname } from "path"
import AdmZip from "adm-zip"
import { fileURLToPath } from "url"

function download(url, dest) {

    console.log(`Fetching ${url}`)

    return new Promise((resolve, reject) => {

        var file = createWriteStream(dest);

        try {

            http.get(url, function (response) {

                const { statusCode } = response

                if (statusCode !== 200) {

                    throw new Error("Network error downloading " + url)
                }

                response
                    .pipe(file)
                    .on("error", () => {

                        unlink(file)

                        throw new Error("Cannot write to file")
                    })

                file.on("finish", function () {

                    resolve()

                }).on("error", () => {

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

    mkdirSync(installsDir, { recursive: true })

    // download

    const outputFile = path.join(installsDir, fileName)

    if (!existsSync(outputFile)) {

        const updatesUrl = "https://updates.phasereditor2d.com"
        const fileUrl = `${updatesUrl}/v${ver}/PhaserEditor2D-core-${ver}-${platform}.zip`

        await download(fileUrl, outputFile)
    }

    // unzip

    console.log(`Unzipping ${outputFile}`)

    mkdirSync(distInstallDir, { recursive: true })

    const zip = new AdmZip(outputFile)

    zip.extractAllTo(distInstallDir, true)

    if (platform !== "windows") {

        chmodSync(execFile, "777");
    }

    // TODO check md5sum

    return execFile
}