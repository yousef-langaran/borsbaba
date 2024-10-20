import * as React from "react";
import {Avatar,AvatarProps} from "@nextui-org/avatar";

export const UAvatar = ({children,...props}: AvatarProps) => (
    <Avatar
        {...props}>
        {children}
    </Avatar>
);