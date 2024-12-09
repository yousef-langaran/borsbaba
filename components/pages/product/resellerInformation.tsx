import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Link} from "@nextui-org/link";
import {Image} from "@nextui-org/image";
import {Divider} from "@nextui-org/react";
import {useMemo} from "react";
import _ from "lodash"
import {Icon} from "@iconify/react";
import {ShowPrice} from "@/components/core/price/showPrice";
import {AddBasketButton} from "@/components/core/basket/addBasketButton";

interface ResellerInformationProps {
    resellers: any
}

export const ResellerInformation = (props: ResellerInformationProps) => {
    const getMinPriceReseller = useMemo<any>(() => {
        return _.minBy(props.resellers, 'b2CPrice')
    }, [props.resellers])
    return (
        <Card
            className="md:shadow-medium shadow-none">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <h3 className="font-bold">فروشنده</h3>
                    <Link className="text-sm">{props.resellers?.length} فروشنده دیگر</Link>
                </div>
            </CardHeader>
            <CardBody>
                <div className="flex flex-col gap-5">
                    <div className="flex gap-2">
                        {/*<Image src=""></Image>*/}
                        <div className="flex-grow">
                            <span>{getMinPriceReseller?.storeName}</span>
                            <div className="flex text-xs mt-2">
                                <span><span className="text-green-600">100%</span> رضایت کاربران</span>
                                <Divider orientation="vertical" className="w-4"/>
                                <span>عملکرد <span className="text-green-600">عالی</span></span>
                            </div>
                        </div>
                    </div>
                    <Divider/>
                    <div className="flex gap-2 items-center">
                        <Icon fontSize="30" icon="gala:secure"/>
                        <span>گارانتی ۱۸ ماهه کاریان همراه</span>
                    </div>
                    <Divider/>
                    <div className="flex gap-2 items-center">
                        <Icon fontSize="30" icon="mdi:truck-fast"/>
                        <span>ارسال فوری امروز فعلا در مشهد</span>
                    </div>
                    <Divider className={"hidden md:block"}/>
                    <div className="flex-col items-end gap-5 hidden md:flex">
                        <div className="flex gap-2 items-center">
                            <ShowPrice data={getMinPriceReseller} priceKey="b2CPrice"/>
                        </div>
                        <div className="w-full">
                            <AddBasketButton data={getMinPriceReseller} block/>
                        </div>
                    </div>
                    <div className="w-full fixed bottom-[4.5rem] p-2 shadow border-t bg-white right-0 z-10 md:hidden">
                        <div className="flex items-center justify-between h-full">
                            <div>
                                <AddBasketButton data={getMinPriceReseller} block/>
                            </div>
                            <div>
                                <ShowPrice data={getMinPriceReseller} priceKey="b2CPrice"/>
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
)
}