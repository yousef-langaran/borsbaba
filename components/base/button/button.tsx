import * as React from "react";
import {UseButtonProps} from "@nextui-org/button/dist/use-button";
import {Button} from "@nextui-org/button";

export const UButton = ({children,...props}: UseButtonProps) => (
    <Button
        {...props}>
        {children}
    </Button>
);