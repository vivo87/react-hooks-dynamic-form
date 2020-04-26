/*
 * Bug propTypes for tsx: https://github.com/strothj/react-docgen-typescript-loader/issues/33
 * => Must specify tsConfigPath
 */
const path = require("path");

module.exports = [
  // Must be before CRA preset
  // @storybook/addon-docs/react/preset deprecated: Framework-specific presets are no longer-needed as of Storybook 5.3
  "@storybook/addon-docs/preset",
  {
    name: "@storybook/preset-create-react-app",
    options: {
      tsDocgenLoaderOptions: {
        tsconfigPath: path.resolve(__dirname, "../tsconfig.json"),
      },
    },
  },
];
