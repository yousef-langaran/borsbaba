import {useMemo} from "react";
import _ from "lodash"
import {GetProductSpecificationResult} from "@/services/digimal";
import {CoreTitle} from "@/components/core/title";

interface SpecificationsProps {
    specifications?: Array<GetProductSpecificationResult> | null
}

export const Specifications = ({specifications}: SpecificationsProps) => {
    const specificationsGrouped = useMemo<any>(() => {
        return _.groupBy(specifications, 'title')
    }, [specifications])
    return (
        <div className={"flex flex-col gap-4"}>
            <div>
                <CoreTitle title={"مشخصات"}/>
            </div>
            <div>
                {!!specificationsGrouped && Object.keys(specificationsGrouped).map((key, index) => (
                    <div key={`title${index}`} className="flex gap-8 even:bg-content2 p-2 rounded-xl">
                        <div className="w-80 my-auto">
                            <p>{key}</p>
                        </div>
                        <div>
                            {specificationsGrouped[key].map((spec:any, index2:number) => (
                                <p key={`values${index2}`}>{spec.value}</p>
                            ))}
                        </div>
                    </div>
                ))
                }
            </div>
        </div>
    )
}