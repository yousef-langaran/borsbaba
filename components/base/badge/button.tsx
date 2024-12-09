import * as React from "react";
import {UseBadgeProps} from "@nextui-org/react";
import {Badge} from "@nextui-org/react";

export const UBadge = ({children,...props}: UseBadgeProps) => (
    <Badge
        {...props}>
        {children}
    </Badge>
);