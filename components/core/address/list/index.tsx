import React, {forwardRef, useImperativeHandle, useState, useEffect, useRef} from "react";
import api from "@/services/useApi";
import {Modal, ModalBody, ModalContent, ModalHeader} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";
import {Icon} from "@iconify/react";
import {cn, Divider, Radio, RadioGroup} from "@nextui-org/react";
import {useDisclosure} from "@reactuses/core";
import {AddressAdd} from "@/components/core/address/add";

interface AddressAddProps {
    onChange?: any;
}

export const AddressList = forwardRef(({onChange}: AddressAddProps, ref) => {
    const [listAddress, setListAddress] = useState<any>([]);
    const [address, setAddress] = useState<any>();
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const addressAddRef = useRef<{ openModal: () => void; closeModal: () => void }>(null);
    useImperativeHandle(ref, () => ({
        openModal: onOpen,
        closeModal: onClose,
    }));
    useEffect(() => {
        onChange?.(listAddress?.find((i: any) => i?.id === address))
    }, [address]);

    const fetchListAddress = async () => {
        try {
            const {data}: any = await api.AddressApi.apiServicesAppAddressGetAllGet();
            setListAddress(data?.result?.addressesList || []);
            setAddress(data?.result?.addressesList?.[0]?.id || "");
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchListAddress();
    }, []);

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader>
                        <p>انتخاب آدرس</p>
                    </ModalHeader>
                    <ModalBody>
                        <div className={"flex flex-col gap-4"}>
                            <Button onClick={()=>addressAddRef.current && addressAddRef.current.openModal()} color={"primary"} variant="flat">
                                <Icon icon={"solar:add-circle-broken"} fontSize={25}/>
                                <span>افزودن آدرس جدید</span>
                            </Button>
                            <Divider/>
                            <RadioGroup onValueChange={setAddress} value={address}>
                                {listAddress.map((item: any) => (
                                    <Radio
                                        key={item.id}
                                        description={item.postalCode}
                                        value={item.id}
                                        classNames={{
                                            base: cn(
                                                "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                                                "flex-row-reverse max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
                                                "data-[selected=true]:border-primary"
                                            ),
                                        }}
                                    >
                                        {item.address}
                                    </Radio>
                                ))}
                            </RadioGroup>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <AddressAdd ref={addressAddRef}/>
        </>
    );
});
