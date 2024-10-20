import * as React from "react";
import {Link,LinkProps} from "@nextui-org/link";

export const ULink = ({children,...props}: LinkProps) => (
    <Link
        {...props}>
        {children}
    </Link>
);