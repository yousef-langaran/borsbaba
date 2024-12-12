import {Card, CardBody, Button, Input} from "@nextui-org/react";
import {Icon} from "@iconify/react";
import {AppLogo} from "@/components/core/app/logo";
import {ShowPrice} from "@/components/core/price/showPrice";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {useEffect, useRef, useState} from "react";
import {getBasket} from "@/redux/reducers/basket";
import api from "@/services/useApi";
import {AddressCurrent} from "@/components/core/address/current";
import {AddressList} from "@/components/core/address/list";

interface PageCheckoutShippingProps {

}

export const PageCheckoutShipping = (props: PageCheckoutShippingProps) => {
    const basket = useSelector((state: RootState) => state.basket.basket)
    const [isLoading, setIsLoading] = useState(false)
    const [address, setAddress] = useState<any>(null)
    const dispatch: AppDispatch = useDispatch()
    const addressListRef = useRef<{ openModal: () => void; closeModal: () => void }>(null);
    const fetchAddFactor = async () => {
        try {
            setIsLoading(true)
            const {data}: any = await api.FactorApi.apiServicesAppFactorAddFactorPost({
                addressId: address?.id,
                discountPrice: 0,
                factorTypeId: 3,
                priceTypeId: 2,
                settlementTypeId: 0,
                description: '',
                shopId: 1
            })
            if (data.result.isSuccessful) {
                window.open(data.result.outputRes)
            }
            setIsLoading(false)
        } catch (e) {
            setIsLoading(false)
            console.error(e)
        }
    }
    useEffect(() => {
        dispatch(getBasket())
    }, []);
    return (
        <>
            <AddressList ref={addressListRef} onChange={setAddress}/>
            <div className="containerCustom mx-auto">
                <div className="md:mb-4 border-b-2">
                    <Card>
                        <CardBody>
                            <div className="relative flex flex-row justify-center items-center mx-auto md:bg-white">
                                <Button href={"/checkout/cart"}
                                        className="static mr-0 ml-auto color-heading right-0 flex items-center text-black">
                                    <Icon icon={"i-heroicons:arrow-small-right-20-solid"}/>
                                    <span className={"hidden md:inline"}>اطلاعات ارسال و پرداخت</span>
                                </Button>
                            </div>
                            <AppLogo/>
                        </CardBody>
                    </Card>
                </div>
                <div>
                    <div className="flex gap-4">
                        <div className="grow grid md:gap-4 divide-y h-fit">
                            <AddressCurrent address={address} onChange={()=> addressListRef.current && addressListRef.current.openModal()}/>
                            <Card>
                                <CardBody>
                                    <div className={"flex gap-2 items-center"}>
                                        <Input label={"کد تخفیف"} className={"w-96"}/>
                                        <Button size={"lg"} color={"primary"}>ثبت</Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                        <div className={"hidden md:inline w-[300px] h-fit"}>
                            <Card>
                                <CardBody>
                                    <div className="grid gap-5">
                                        <div className="flex justify-between items-center text-sm">
                                            <span>قابل پرداخت</span>
                                            <ShowPrice data={{price: basket?.totalPrice}} notCount/>
                                        </div>
                                        <Button color={"primary"} onClick={fetchAddFactor} isLoading={isLoading}>پرداخت</Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                    <div className={"inline md:hidden w-full fixed bottom-0 p-2 shadow border-t bg-white right-0"}>
                        <div className="flex items-center justify-between h-full">
                            <div>
                                <span className="text-xs">قابل پرداخت</span>
                                <ShowPrice data={{price: basket?.totalPrice}} notCount/>
                            </div>
                            <div>
                                <Button onClick={fetchAddFactor} color={"primary"} isLoading={isLoading}>پرداخت</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}