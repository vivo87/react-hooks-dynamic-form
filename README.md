# Introduction

Generating dynamic form the React Hooks way

# Getting Started

```shell
npm install
```

The repository includes 2 separate modules managed by [Lerna](https://lernajs.io/)

- The npm library: [README](/packages/rhdf-lib/README.md)
- A demo storybook: [README](/packages/rhdf-demo/README.md)

At root level, run

```shell
npm start
```

to start both the 2 modules.

# Release

As the lib itself is under a subdirectory, it can't find the `.git` folder in root directory. Therefore, we must create a `.git` folder in `/packages/rhdf-lib` for `npm version` script to work properly. See [this issue](https://github.com/npm/npm/issues/9111).

```shell
cd packages/rhdf-lib
mkdir .git
```
