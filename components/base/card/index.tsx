import * as React from "react";
import {UseCardProps} from "@nextui-org/card/dist/use-card";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/react";
import {CardFooterProps} from "@nextui-org/card/dist/card-footer";
import {HTMLNextUIProps} from "@nextui-org/system";

export const UCard = ({children, ...props}: UseCardProps) => (
    <Card
        {...props}>
        {children}
    </Card>
);
export const UCardHeader = ({children, ...props}: HTMLNextUIProps) => (
    <CardHeader
        {...props}>
        {children}
    </CardHeader>
);
export const UCardBody = ({children, ...props}: HTMLNextUIProps) => (
    <CardBody
        {...props}>
        {children}
    </CardBody>
);
export const UCardFooter = ({children, ...props}: CardFooterProps) => (
    <CardFooter
        {...props}>
        {children}
    </CardFooter>
);