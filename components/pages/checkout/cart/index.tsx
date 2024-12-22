import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {ProductList} from "@/components/core/product/productList";
import {useMemo} from "react";
import _ from "lodash"
import {ShowPrice} from "@/components/core/price/showPrice";
import {Button} from "@nextui-org/button";
import {useRouter} from "next/router";

interface PageCheckoutCartProps {

}

export const PageCheckoutCart = (props: PageCheckoutCartProps) => {
    const router = useRouter()
    const basket = useSelector((state: RootState) => state.basket.basket)
    const productPrice = useMemo(()=>{
        return  _.sumBy(basket?.basketItems, item => +item?.price * +item?.count)
    },[basket?.basketItems])
    return (
        <div className="container mx-auto px-2">
            {
                basket?.totalCount ?
                    <div className="md:flex md:gap-4 grid gap-2">
                        <Card className={"grow"}>
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
                        <div className="w-full h-fit absolute bottom-[3.5rem] left-0 right-0 md:static md:left-none md:right-none md:w-[300px]">
                            <Card classNames={{base: "rounded-none md:rounded-2xl"}}>
                                <CardBody>
                                    <div className="flex justify-between items-center md:items-stretch md:flex-col gap-5">
                                        <div className="justify-between items-center text-sm text-neutral-500 hidden md:flex">
                                            <span>قیمت کالاها (3)</span>
                                            <ShowPrice data={{price: productPrice}} notCount/>
                                        </div>
                                        <div className="justify-between items-start md:items-center text-sm flex flex-col md:flex-row">
                                            <span>جمع سبد خرید</span>
                                            <ShowPrice data={{price: basket?.totalPrice}} notCount/>
                                        </div>
                                        {!!(productPrice - basket?.totalPrice) &&
                                            <div className="justify-between items-center text-sm text-red-500 hidden md:flex">
                                                <span>سود شما از خرید</span>
                                                <ShowPrice data={{price: productPrice - basket?.totalPrice}} notCount/>
                                            </div>}
                                        <Button onClick={()=> router.push("/checkout/shipping")} color={"primary"} className={"w-fit md:w-full"}>
                                            تایید و تکمیل سفارش
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                            <p className="text-[11px] text-neutral-500 my-4 hidden md:inline">هزینه این سفارش هنوز پرداخت نشده‌ و در صورت اتمام موجودی، کالاها از سبد حذف می‌شوند</p>
                        </div>
                    </div>
                    :
                    <></>
            }
        </div>
    )
}