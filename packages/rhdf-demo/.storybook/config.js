import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

// Show story info (source code ...)
addDecorator(withInfo);

// automatically import all files ending in *.stories.tsx?
configure(require.context('../src', true, /\.stories\.tsx?$/), module);
