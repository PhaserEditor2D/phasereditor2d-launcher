# Phaser Editor 2D v3 Launcher

Modern (and professional) Phaser game development uses [npmjs](https://www.npmjs.com/) for managing the game dependencies. Common dependencies are Phaser, third-party libraries, and tools like TypeScript or Webpack.

The `phasereditor2d-launcher` is a node package for wrapping Phaser Editor 2D Core, so you can install it and manage it as a dependency of your game project.

## Install

You can install it as a project development dependency:

```bash
$ npm install --save-dev phasereditor2d-launcher
```

Or install it globally:

```bash
$ npm install -g phasereditor2d-launcher
```

## Running the launcher

The `phasereditor2d-launcher` package is a command line tool. You can run it like this:

```bash
$ npx phasereditor2d-launcher -- -project path/to/project
```

Note you should write the Phaser Editor 2D Core arguments after the `--` string.


If you used one of the project templates provided by Phaser Editor 2D, then you can run the launcher this way:

```bash
$ npm run editor
```

Where `editor` is a script defined in the `package.json` file:

```json
"scritps": {
    "editor": "phasereditor2d-launcher -project ."
}
```


### Fetching Phaser Editor 2D binaries

When you run the launcher the first time, it downloads the Phaser Editor 2D Core binaries for your platform. The binaries are installed in your user home directory: `~/.phasereditor2d/installs`.

## Some advantages

There are a couple of advantages of installing Phaser Editor 2D as a node package dependency:

* You can install it globally, and NPM will update the system `PATH` for you.
* You can install it as a dependency of your project (recommended), and teammates working in the same project will use the same version of the editor.
* You can update the editor using the NPM update command.

