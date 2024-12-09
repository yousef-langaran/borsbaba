import * as React from "react";
import {Image, ImageProps} from "@nextui-org/react";

export const UImage = ({children,...props}: ImageProps) => (
    <Image
        {...props}>
        {children}
    </Image>
);