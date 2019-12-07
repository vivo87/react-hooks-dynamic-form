import React, { FC } from "react";
import { action } from "@storybook/addon-actions";

export default {
  title: "Sample",
};

interface ButtonProps {
  onClick?: () => void;
}
type ButtonFC<T> = FC<T> & { story?: { name: string } };

export const text: ButtonFC<ButtonProps> = () => (
  <button onClick={action("clicked")}>Hello button</button>
);
text.story = {
  name: "Button With Text",
};

export const emoji: ButtonFC<ButtonProps> = () => (
  <button onClick={action("clicked")}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </button>
);
emoji.story = {
  name: "Button With Emoji",
};
