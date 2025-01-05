import React from "react";
import {ComponentConfig} from "@measured/puck";
import {ImageProps} from "@nextui-org/react";
import {UImage} from "@/components/base/image/image";


export const Image: ComponentConfig<ImageProps> = {
  label: "Image",
  fields: {
    alt: {type: "text"},
    src: {type: "text"}
  },
  render: ({alt, src}) => {
    return (
        <div>
          <UImage alt={alt} src={src}/>
        </div>
    );
  },
};
