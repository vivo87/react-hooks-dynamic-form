import { configure } from "@storybook/react";
import { configureActions } from '@storybook/addon-actions';

configureActions({
  depth: 1,
  // Limit the number of items logged into the actions panel
  limit: 10,
});

/**
 * Addon-info is being replaced by addon-docs docsPage
 * https://github.com/storybookjs/storybook/blob/master/addons/docs/docs/docspage.md
 */
// import { addDecorator } from "@storybook/react";
// import { withInfo } from "@storybook/addon-info";

// Add default info style, hide all modules and show if needed in stories
// addDecorator(
//   withInfo({
//     styles: {
//       header: {
//         h1: {
//           marginRight: "20px",
//           fontSize: "25px",
//           display: "inline",
//         },
//         body: {
//           paddingTop: 0,
//           paddingBottom: 0,
//         },
//         h2: {
//           display: "inline",
//           color: "#999",
//         },
//       },
//       infoBody: {
//         padding: 0,
//         lineHeight: "2",
//       },
//     },
//     inline: true,
//     header: false,
//     source: false,
//     propTables: false,
//   })
// );

// automatically import all files ending in mdx tsx
configure([
  require.context("../src/stories", false, /Intro\.stories\.(mdx|[tj]sx?)$/),
  require.context("../src/stories", true, /\.stories\.(mdx|[tj]sx?)$/)
], module);
