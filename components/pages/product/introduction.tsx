import {useMemo} from "react";
import _ from "lodash"
import {GetProductSpecificationResult} from "@/services/digimal";
import {CoreTitle} from "@/components/core/title";

interface IntroductionProps {
    introduction?: string | null
}

export const Introduction = ({introduction}: IntroductionProps) => {
    return (
        <div className={"flex flex-col gap-4"}>
            <div>
                <CoreTitle title={"معرفی"}/>
            </div>
            <div>
                {introduction}
            </div>
        </div>
    )
}