import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {addBasket, deleteBasketItem, updateBasketItem} from "@/redux/reducers/basket";
import {Icon} from "@iconify/react";

interface AddBasketButtonProps {
    block?: boolean,
    data: any,
    size?: 'xs' | 'sm' | 'lg' | 'xl' | '2xl',
    countKey?: string,
    notCount?: boolean
}

export const AddBasketButton = ({
                                    block,
                                    data,
                                    size,
                                    countKey = 'remainingCount',
                                    notCount
                                }: AddBasketButtonProps) => {
    const dispatch: AppDispatch = useDispatch()
    const basket = useSelector((state: RootState) => state.basket.basket)
    const [isLoading, setIsLoading] = useState(false)
    const basketDto = useMemo(() => {
        return {
            price: data?.b2CPrice || 0,
            priceTypeId: 2 as any,
            productAndPropertyPriceId: data?.productAndPropertyPriceId || 0
        }
    }, [data])
    const getProductInBasket = useMemo(() => {
        return basket?.basketItems?.find((item) => item?.productAndPropertyPriceId === data?.productAndPropertyPriceId)
    }, [basket?.basketItems])
    const addBasketItem = async () => {
        setIsLoading(true)
        await dispatch(addBasket(basketDto))
        setIsLoading(false)
    }

    const updateBasketsItem = async (count: number) => {
        setIsLoading(true)
        await dispatch(updateBasketItem({
            id: getProductInBasket?.id || 0,
            count: count,
            priceType: basketDto?.priceTypeId,
            productAndPropertyPriceId: basketDto?.productAndPropertyPriceId,
        }))
        setIsLoading(false)
    }

    const deleteItemBasket = async () => {
        setIsLoading(true)
        const id = getProductInBasket?.id || 0
        await dispatch(deleteBasketItem(id))
        setIsLoading(false)
    }
    return (
        <>
            {(countKey && +data?.[countKey] || notCount) &&
                <div>
                    {!getProductInBasket ?
                        <Button color={`primary`} className={`${block && 'w-full'}`}
                                onClick={addBasketItem}
                                isLoading={isLoading}>افزودن به سبد خرید
                        </Button>
                        :
                        <div className={"flex gap-2"}>
                            <Button color={"success"} isIconOnly
                                    onClick={() => updateBasketsItem(getProductInBasket.count ? +getProductInBasket.count + 1 : 0)}>
                                <Icon icon={"hugeicons:add-01"} fontSize={25}/>
                            </Button>
                            <Input classNames={{input: 'text-center'}}
                                   value={getProductInBasket?.count ? getProductInBasket?.count.toString() : "0"}
                                   readOnly variant={"bordered"} className={"w-20"} color={"primary"}/>
                            {getProductInBasket.count && getProductInBasket.count === 1 ?

                                <Button color={"danger"} isIconOnly onClick={deleteItemBasket}>
                                    <Icon icon={"hugeicons:delete-03"} fontSize={25}/>
                                </Button>
                                :
                                <Button color={"danger"} isIconOnly
                                        onClick={() => updateBasketsItem(getProductInBasket.count ? +getProductInBasket.count - 1 : 0)}>
                                    <Icon icon={"hugeicons:minus-sign"} fontSize={25}/>
                                </Button>
                            }
                        </div>
                    }
                </div>
            }
        </>
    )
}