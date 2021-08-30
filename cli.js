#!/usr/bin/env node

import { installEditor } from "./installEditor.js"
import child_process from "child_process"

const execFile = await installEditor()
const args = process.argv.slice(2)

console.log(`Launching ${execFile} [${args.map(s => `"${s}"`).join(",")}]`)
console.log()

child_process.spawnSync(execFile, args, {
    windowsHide: true,
    detached: false,
    stdio: "inherit"
});