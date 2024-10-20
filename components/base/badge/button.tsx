import * as React from "react";
import {UseBadgeProps} from "@nextui-org/badge/dist/use-badge";
import {Badge} from "@nextui-org/badge";

export const UBadge = ({children,...props}: UseBadgeProps) => (
    <Badge
        {...props}>
        {children}
    </Badge>
);