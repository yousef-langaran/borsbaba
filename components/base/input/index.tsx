import {IconSvgProps} from "@/types";
import * as React from "react";
import {UseInputProps} from "@nextui-org/input/dist/use-input";
import {Input} from "@nextui-org/input";

export const UInput = ({...props}: UseInputProps) => (
    <Input
        {...props}>
    </Input>
);