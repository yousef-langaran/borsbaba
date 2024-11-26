import {Popover, PopoverContent, PopoverTrigger} from "@nextui-org/popover";
import {Button} from "@nextui-org/button";
import {UIcon} from "@/components/base/icon";
import {Badge} from "@nextui-org/badge";
import React, {useRef} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {ShowPrice} from "@/components/core/price/showPrice";
import {ProductList} from "@/components/core/product/productList";

export const BasketPopover = () => {
    const basket = useSelector((state: RootState) => state.basket.basket)
    const buttonRef = useRef(null);

    return (
        <Popover triggerRef={buttonRef}>
            <PopoverTrigger>
                    <Badge content={basket?.totalCount} color="danger" placement="bottom-right">
                        <Button ref={buttonRef} variant="ghost" isIconOnly
                                endContent={<UIcon className="text-xl" icon="tabler:basket"/>}>
                        </Button>
                    </Badge>
            </PopoverTrigger>
            <PopoverContent className={"!p-0"}>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between">
                            <span> {basket?.totalCount} کالا</span>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {basket?.basketItems && basket?.basketItems.map((basketItem, index) => (
                            <div key={index} className="py-4">
                                <ProductList data={basketItem}/>
                            </div>
                        ))
                        }
                    </CardBody>
                    <CardFooter>
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm m1-2">مبلغ قابل پرداخت:</p>
                                <ShowPrice data={{price: basket?.totalPrice}} className="text-2xl font-bold"/>
                            </div>
                            <Button href={"/checkout/cart"}>ثبت سفارش</Button>
                        </div>
                    </CardFooter>
                </Card>
            </PopoverContent>
        </Popover>
    )
}