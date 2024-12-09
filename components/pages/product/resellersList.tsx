import {CoreTitle} from "@/components/core/title";
import {GetResellerInfoResult} from "@/services/digimal";
import {Button} from "@nextui-org/button";
import {Icon} from "@iconify/react";
import {Divider,Image} from "@nextui-org/react";
import {ShowPrice} from "@/components/core/price/showPrice";
import {AddBasketButton} from "@/components/core/basket/addBasketButton";

interface ResellersListProps {
    resellers?: Array<GetResellerInfoResult>,
}

export const ResellersList = ({resellers}: ResellersListProps) => {
    return (
        <>
            <CoreTitle title="فروشندگان این کالا" tag="p"/>
            {!!resellers && resellers.map((reseller,index) => (
                <div key={index}
                    className="odd:bg-gray-100 flex flex-col divide-y divide-slate-200 p-4 lg:flex-row lg:justify-between lg:divide-y-0">
                    <div className="flex gap-2 items-center py-4">
                        {/*<Image src=""/>*/}
                        <div className="flex-grow">
                            <span>{reseller.storeName}</span>
                            <div className="flex text-xs mt-2">
                                <span><span className="text-green-600">100%</span> رضایت کاربران</span>
                                <Divider orientation="vertical" className="w-4"/>
                                <span>عملکرد <span className="text-green-600">عالی</span></span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center py-4">
                        <Icon icon={"mdi:truck-fast"} fontSize={30}/>
                        <span>ارسال فوری امروز فعلا در مشهد</span>
                    </div>
                    <div className="flex gap-2 items-center py-4">
                        <Icon icon={"gala:secure"} fontSize={30}/>
                        <span>گارانتی اصالت و سلامت کالا</span>
                    </div>
                    <div>
                        <div className="flex gap-2 items-center py-4">
                            <ShowPrice data={{price: reseller.b2CPrice}} notCount/>
                        </div>
                    </div>
                    <div className="py-4">
                        <AddBasketButton data={reseller}/>
                    </div>
                </div>
            ))
            }
        </>
    )
}