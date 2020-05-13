# Introduction

Generating dynamic form the React Hooks way

<br/>

See the full demo with **[storybook](https://vivo87.github.io/react-hooks-dynamic-form/)**

<br/>

# Getting Started

```shell
npm install
```

The repository includes 2 separate modules managed by [Lerna](https://lernajs.io/)

- The library: [README](/packages/rhdf-lib/README.md)
- A demo website with storybook: [README](/packages/rhdf-demo/README.md)

At root level, run

```shell
npm start
```

to start both the 2 modules.

# Release

As the lib itself is under a subdirectory, it may not find the `.git` folder in root directory. Therefore, if this error occurs, we must create a `.git` folder in `/packages/rhdf-lib` for `npm version` script to work properly. See [this issue](https://github.com/npm/npm/issues/9111).

```shell
cd packages/rhdf-lib
mkdir .git
```
