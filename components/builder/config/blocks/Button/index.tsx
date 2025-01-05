import React from "react";
import {ComponentConfig} from "@measured/puck";
import {Button as ButtonNextUi, ButtonProps} from "@nextui-org/button";


export const Button: ComponentConfig<ButtonProps> = {
  label: "Button",
  fields: {
    children: { type: "text" },
    href: { type: "text" },
    variant: {
      type: "select",
      options: [
        { label: "flat", value: "flat" },
        { label: "ghost", value: "ghost" },
        { label: "bordered", value: "bordered" },
        { label: "light", value: "light" },
      ],
    },
  },
  defaultProps: {
    children: "Button",
    href: "#",
    variant: "flat",
  },
  render: ({ href, variant, children, puck }) => {
    return (
      <div>
        <ButtonNextUi
          href={puck.isEditing ? "#" : href}
          variant={variant}
          size="lg"
          tabIndex={puck.isEditing ? -1 : undefined}
        >
          {children}
        </ButtonNextUi>
      </div>
    );
  },
};
