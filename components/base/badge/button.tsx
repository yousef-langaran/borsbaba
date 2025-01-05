import * as React from "react";
import {Badge, BadgeProps} from "@nextui-org/react";

export const UBadge = ({children,...props}: BadgeProps) => (
    <Badge
        {...props}>
        {children}
    </Badge>
);