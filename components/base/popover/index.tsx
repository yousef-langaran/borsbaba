import * as React from "react";
import {UsePopoverProps} from "@nextui-org/popover/dist/use-popover";
import {Popover, PopoverTrigger, PopoverContent} from "@nextui-org/popover";
import {PopoverTriggerProps} from "@nextui-org/popover/dist/popover-trigger";
import {PopoverContentProps} from "@nextui-org/react";

export const UPopover = ({children,...props}: UsePopoverProps) => (
    <Popover
        {...props}>
        {children}
    </Popover>
);
export const UPopoverTrigger = ({children,...props}: PopoverTriggerProps) => (
    <PopoverTrigger
        {...props}>
        {children}
    </PopoverTrigger>
);

export const UPopoverContent  = ({children,...props}: PopoverContentProps) => (
    <PopoverContent
        {...props}>
        {children}
    </PopoverContent>
);
