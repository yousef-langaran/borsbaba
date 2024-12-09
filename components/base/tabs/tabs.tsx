import * as React from "react";
import { Tabs,Tab, TabsProps, TabItemProps } from "@nextui-org/react";

export const UTabs = ({ children, ...props }: TabsProps) => (
    <Tabs {...props}>
        {children}
    </Tabs>
);
export const UTab = ({ children, ...props }: TabItemProps) => (
    <Tab {...props}>
        {children}
    </Tab>
);
