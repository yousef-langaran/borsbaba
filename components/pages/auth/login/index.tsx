import {ReactNode} from "react";
import {UCard, UCardBody, UCardHeader} from "@/components/base/card";
import {Logo} from "@/components/icons";

interface PagesLoginProps {
    children?: ReactNode
}

export const PagesLogin = ({children,...props}: PagesLoginProps) => {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <UCard className="w-96">
                <UCardHeader>
                    <Logo/>
                    پرومال
                </UCardHeader>
                <UCardBody>
                    <h1>ورود | ثبت نام</h1>
                    <h5></h5>
                </UCardBody>
            </UCard>
        </div>
    )
}