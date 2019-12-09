import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

// Show story info (source code ...)
addDecorator(withInfo({
  styles: {
    header: {
      h1: {
        marginRight: '20px',
        fontSize: '25px',
        display: 'inline',
      },
      body: {
        paddingTop: 0,
        paddingBottom: 0,
      },
      h2: {
        display: 'inline',
        color: '#999',
      },
    },
    infoBody: {
      padding: 0,
      lineHeight: '2',
    },
  },
  inline: true,
  source: true,
}));

// automatically import all files ending in mdx tsx
configure(require.context('../src', true, /\.stories\.(mdx|[tj]sx?)$/), module);
