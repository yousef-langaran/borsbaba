import {Card, CardBody} from "@nextui-org/card";
import {Icon} from "@iconify/react";
import {Button} from "@nextui-org/button";

interface AddressAddProps {
    address?: any,
    onChange?: any
}
export const AddressCurrent = ({address,onChange}:AddressAddProps) => {
    return(
    <Card>
        <CardBody>
            <div className="grid gap-4">
                <p className="mr-10 text-neutral-400">آدرس تحویل سفارش</p>
                <div className="flex gap-4">
                    <Icon icon={"solar:map-point-broken"} fontSize={25}/>
                    <p>{address?.address}</p>
                </div>
                <p className="mr-10 text-neutral-400">{address?.recipientName } { address?.recipientSurname }</p>
            </div>
            <div className="flex justify-end">
                <Button onClick={()=>onChange(true)} color={"primary"} size="sm" variant="light">
                    <span>تغییر یا ویرایش آدرس</span>
                    <Icon icon={"solar:pen-broken"} fontSize={20}/>
                </Button>
            </div>
        </CardBody>
    </Card>
    )
}