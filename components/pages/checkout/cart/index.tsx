import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {ProductList} from "@/components/core/product/productList";
import {useMemo} from "react";
import _ from "lodash"
import {ShowPrice} from "@/components/core/price/showPrice";
import {Button} from "@nextui-org/button";

interface PageCheckoutCartProps {

}

export const PageCheckoutCart = (props: PageCheckoutCartProps) => {
    const basket = useSelector((state: RootState) => state.basket.basket)
    const productPrice = useMemo(()=>{
        return  _.sumBy(basket?.basketItems, item => +item?.price * +item?.count)
    },[basket?.basketItems])
    return (
        <div className="container mx-auto px-2">
            {
                basket?.totalCount ?
                    <div className="md:flex md:gap-4 grid gap-2">
                        <Card>
                            <CardHeader>
                                <div>
                                    <span>سبد خرید شما</span>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div>
                                    {basket?.basketItems && basket?.basketItems.map(item => (
                                        <ProductList data={item}/>
                                    ))
                                    }
                                </div>
                            </CardBody>
                        </Card>
                        <div className="w-[300px] h-fit hidden md:inline">
                            <Card>
                                <CardBody>
                                    <div className="grid gap-5">
                                        <div className="flex justify-between items-center text-sm text-neutral-500">
                                            <span>قیمت کالاها (3)</span>
                                            <ShowPrice data={{price: productPrice}} notCount/>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span>جمع سبد خرید</span>
                                            <ShowPrice data={{price: basket?.totalPrice}} notCount/>
                                        </div>
                                        {!!(productPrice - basket?.totalPrice) &&
                                            <div className="flex justify-between items-center text-sm text-red-500">
                                                <span>سود شما از خرید</span>
                                                <ShowPrice data={{price: productPrice - basket?.totalPrice}} notCount/>
                                            </div>}
                                        <Button href="/checkout/shipping" color={"primary"} className={"w-full"}>
                                            تایید و تکمیل سفارش
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                            <p className="text-[11px] text-neutral-500 my-4">هزینه این سفارش هنوز پرداخت نشده‌ و در صورت اتمام موجودی، کالاها از سبد حذف می‌شوند</p>
                        </div>
                    </div>
                    :
                    <></>
            }
        </div>
    )
}