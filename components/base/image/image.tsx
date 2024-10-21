import * as React from "react";
import {Image, ImageProps} from "@nextui-org/image";

export const UImage = ({children,...props}: ImageProps) => (
    <Image
        {...props}>
        {children}
    </Image>
);