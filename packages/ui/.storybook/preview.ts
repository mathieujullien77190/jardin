import type { Preview } from '@storybook/react-vite';
import './preview.css';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i } },
    options: {
      storySort: { order: ['Primitives'] },
    },
  },
};

export default preview;
