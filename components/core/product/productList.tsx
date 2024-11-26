import {UImage} from "@/components/base/image/image";
import {GetProductFilterByUserResult} from "@/services/digimal";
import {ShowPrice} from "@/components/core/price/showPrice";
import {Image} from "@nextui-org/image";
import {AddBasketButton} from "@/components/core/basket/addBasketButton";
import {Icon} from "@iconify/react";

interface ProductListProps {
    data: any
}

export const ProductList = (props: ProductListProps) => {
    return (
        <div className="flex">
            <div>
                <Image className="w-24 h-24 ml-4" src={props.data?.url}/>
                <AddBasketButton data={props.data}/>
            </div>
            <div className="flex flex-col w-full gap-4 mr-8">
                <p className="font-bold text-xl">{ props.data?.productName }</p>
                <div className="flex gap-2 items-center text-xs">
                    <Icon icon={"gala:secure"} />
                    <span>ضمانت پرومال، 7 روز بازگشت کالا</span>
                </div>
                <div className="flex gap-2 items-center text-xs">
                    <Icon icon="heroicons:building-storefront"/>
                    <span>{ props.data?.storeName }</span>
                </div>
                <div className="flex gap-2 items-center text-xs">
                    <Icon icon="mdi:truck-fast"/>
                    <span>ارسال فوری امروز فعلا در مشهد</span>
                </div>
                <div className="flex items-center gap-4">
                    <ShowPrice data={props.data} not-count/>
                    <AddBasketButton data={props.data} not-count size="sm"/>
                </div>
            </div>
        </div>
    )
}