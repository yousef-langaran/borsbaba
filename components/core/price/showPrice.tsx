import {UBadge} from "@/components/base/badge/button";

interface ShowPriceProps {
    data: any,
    priceKey?: string,
    specialPriceKey?: string,
    countKey?: string,
    notCount?: boolean,
}

export const ShowPrice = ({
                              priceKey = 'price',
                              specialPriceKey = 'specialPrice',
                              countKey = 'remainingCount',
                              notCount,
                              data
                          }: ShowPriceProps) => {
    return (
        <>
            {
                data?.[countKey] || notCount ?
                    <div className="pt-1 flex flex-col items-stretch justify-between">
                        <div className="flex items-center justify-between">
                            {data?.specialPrice &&
                                <div
                                    className="px-1 text-white rounded-large flex items-center justify-center ProductPrice_ProductPrice__discountWrapper__1Ru_1 bg-hint-object-error">
                                    <UBadge className="rounded-2xl bg-red-600">۷٪</UBadge>
                                </div>
                            }
                            <div className="flex items-center gap-1 text-2xl font-bold grow">
                                <span>{data?.[priceKey]?.toLocaleString()}</span>
                                <div className="flex text-xs">
                                    تومان
                                </div>
                            </div>
                        </div>
                        {data?.[specialPriceKey] &&
                            <div className="flex items-center justify-between pl-8">
                                <div className="text-neutral-300 line-through self-end mr-auto text-sm">
                                    {data?.[specialPriceKey]?.toLocaleString()}
                                </div>
                            </div>
                        }
                    </div>
                    :
                    <div>
                        ناموجود
                    </div>
            }
        </>
    )
}