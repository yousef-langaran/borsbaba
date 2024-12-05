import {Control as RHFControl} from "react-hook-form/dist/types/form";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react"
import NeshanMap, {NeshanMapRef, OlMap, Ol} from "@neshan-maps-platform/react-openlayers"
import {Button} from "@nextui-org/button";
import {useDisclosure} from "@reactuses/core";
import axios from "axios";
import {Input} from "@nextui-org/input";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Controller, useForm} from "react-hook-form";
import {AddAddressDto} from "@/services/digimal";
import {Checkbox, Divider} from "@nextui-org/react";
import api from "@/services/useApi";

interface AddressAddProps {
    onAdded?: () => void
}

const mapKey = "web.3285b73742624f1f9b5245178ae5c537"
const serviceKey = "service.5f5aa6caaebf45d9b7d17a8b93dbe605"
export const AddressAdd = forwardRef(({onAdded}: AddressAddProps, ref) => {
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [step, setStep] = useState(1)
    const [apiData, setApiData] = useState()
    useImperativeHandle(ref, () => ({
        openModal: onOpen,
        closeModal: onClose,
    }));

    const onAddedLocal = () =>{
        onAdded?.()
        onClose()
    }
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            {
                step === 1 ?
                    <Step1 onNext={() => setStep(2)} onClose={onClose} onApi={setApiData}/>
                    :
                    <Step2 apiData={apiData} onBack={() => setStep(1)} onAdded={onAddedLocal}/>
            }
        </Modal>
    )
})

interface Step1Props {
    onNext?: any,
    onClose?: any,
    onApi?: any
}

const Step1 = ({onNext, onClose, onApi}: Step1Props) => {
    const mapRef = useRef<NeshanMapRef | null>(null)
    const [ol, setOl] = useState<Ol>()
    const [olMap, setOlMap] = useState<OlMap>()
    const reverseGeocoding = async (lat: string | number, lng: string | number) => {
        try {
            const {data} = await axios.get(`https://api.neshan.org/v4/reverse?lat=${lat}&lng=${lng}`, {
                headers: {
                    "Api-Key": serviceKey
                }
            })
            onApi?.({...data, lat: lat, lng: lng})
        } catch (e) {
            console.error(e)
        }
    }

    const onInit = async (ol: Ol, map: OlMap) => {
        setOl(ol)
        setOlMap(map)
        const markerSource = new ol.source.Vector();
        const markerLayer = new ol.layer.Vector({
            source: markerSource,
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: '/assets/marker.webp', // مسیر آیکون مارکر
                    scale: 0.03
                }),
            }),
        });
        map.addLayer(markerLayer);
        map.on('click', async (e) => {
            const coordinates = e.coordinate;
            const marker = new ol.Feature({
                type: 'marker',
                geometry: new ol.geom.Point(coordinates),
            });
            markerSource.clear();
            markerSource.addFeature(marker);
            const [longitude, latitude] = ol.proj.toLonLat(coordinates);
            await reverseGeocoding(latitude, longitude)
        })
    }
    return (
        <ModalContent>
            <ModalHeader>
                <div>
                    <h2 className="font-bold">انتخاب آدرس روی نقشه</h2>
                </div>
            </ModalHeader>
            <ModalBody>
                <div className="w-full h-96 rounded-xl overflow-hidden">
                    <NeshanMap
                        ref={mapRef}
                        mapKey={mapKey}
                        defaultType="neshan"
                        center={{latitude: 35.7665394, longitude: 51.4749824}}
                        style={{height: "48vh", width: "100%"}}
                        onInit={onInit}
                        zoom={13}
                        traffic={false}
                        poi={false}
                    ></NeshanMap>
                </div>
            </ModalBody>
            <ModalFooter>
                <div className="flex justify-end gap-4">
                    <Button variant={"light"} onClick={onClose}>بستن</Button>
                    <Button color={"primary"} onClick={onNext}>تایید و ادامه</Button>
                </div>
            </ModalFooter>
        </ModalContent>
    )
}

const schema = yup
    .object({
        address: yup.string().required(),
        city: yup.string().required(),
        longitude: yup.string().required(),
        postalCode: yup.string().required(),
        isRecipientMySelf: yup.boolean().required('اجباری'),
        latitude: yup.string().required(),
        province: yup.string().required(),
        recipientMobileNumber: yup.string().required(),
        recipientName: yup.string().required(),
        recipientSurname: yup.string().required(),
    })

interface Step2Props {
    apiData?: any
    onBack?: () => void
    onAdded?: () => void
}

const Step2 = ({apiData, onBack, onAdded}: Step2Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const {
        handleSubmit,
        control,
        formState: {errors},
        watch,
        setValue
    } = useForm<AddAddressDto>({
        resolver: yupResolver(schema),
        defaultValues: {
            isRecipientMySelf: false
        }
    });
    const isRecipientMySelf = watch('isRecipientMySelf');
    const onSubmit = async (formData:AddAddressDto) => {
        setIsLoading(true)
        const {data} : any = await api.AddressApi.apiServicesAppAddressAddPost(formData)
        if (data?.result?.isSuccessful){
            onAdded?.()
        }
        setIsLoading(false)
    }
    useEffect(() => {
        onDataApi(apiData)
    }, [apiData]);
    const onDataApi = (apiData: any) => {
        setValue('address', apiData?.formatted_address)
        setValue('city', apiData?.city)
        setValue('latitude', apiData?.lat)
        setValue('longitude', apiData?.lng)
        setValue('province', apiData?.state)
    }
    return (
        <ModalContent>
            <ModalHeader>
                <div>
                    <h2 className="font-bold">اطلاعات دقیق آدرس</h2>
                </div>
            </ModalHeader>
            <ModalBody>
                <form className={"grid grid-cols-4 gap-4"}>
                    <div className={"col-span-4"}>
                        <Controller
                            control={control}
                            name="address"
                            render={({field}) => (
                                <Input
                                    errorMessage={errors.address?.message}
                                    isInvalid={!!errors.address?.message}
                                    label="آدرس"
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <div className={"col-span-2"}>
                        <Controller
                            control={control}
                            name="province"
                            render={({field}) => (
                                <Input
                                    errorMessage={errors.province?.message}
                                    isInvalid={!!errors.province?.message}
                                    label="استان"
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <div className={"col-span-2"}>
                        <Controller
                            control={control}
                            name="city"
                            render={({field}) => (
                                <Input
                                    errorMessage={errors.city?.message}
                                    isInvalid={!!errors.city?.message}
                                    label="شهر"
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <div className={"col-span-1"}>
                        <Controller
                            control={control}
                            name="plaque"
                            render={({field}) => (
                                <Input
                                    errorMessage={errors.plaque?.message}
                                    isInvalid={!!errors.plaque?.message}
                                    label="شهر"
                                    value={field.value || ''}
                                    onBlur={field.onBlur}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <div className={"col-span-1"}>
                        <Controller
                            control={control}
                            name="unit"
                            render={({field}) => (
                                <Input
                                    errorMessage={errors.unit?.message}
                                    isInvalid={!!errors.unit?.message}
                                    label="واحد"
                                    value={field.value || ''}
                                    onBlur={field.onBlur}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <div className={"col-span-2"}>
                        <Controller
                            control={control}
                            name="postalCode"
                            render={({field}) => (
                                <Input
                                    errorMessage={errors.postalCode?.message}
                                    isInvalid={!!errors.postalCode?.message}
                                    label="کد پستی"
                                    value={field.value || ''}
                                    onBlur={field.onBlur}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <div className={"col-span-4"}>
                        <Divider/>
                    </div>

                    <div className={"col-span-4"}>
                        <Controller
                            control={control}
                            name="isRecipientMySelf"
                            render={({field}) => (
                                <Checkbox
                                    isInvalid={!!errors.isRecipientMySelf?.message}
                                    value={field.value as any}
                                    onBlur={field.onBlur}
                                    onChange={field.onChange}
                                >گیرنده سفارش خودم هستم.</Checkbox>
                            )}
                        />
                    </div>
                    <div className={"col-span-2"}>
                        <Controller
                            control={control}
                            name="recipientName"
                            render={({field}) => (
                                <Input
                                    errorMessage={errors.recipientName?.message}
                                    isInvalid={!!errors.recipientName?.message}
                                    disabled={isRecipientMySelf}
                                    label="نام گیرنده"
                                    value={field.value || ''}
                                    onBlur={field.onBlur}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <div className={"col-span-2"}>
                        <Controller
                            control={control}
                            name="recipientSurname"
                            render={({field}) => (
                                <Input
                                    errorMessage={errors.recipientSurname?.message}
                                    isInvalid={!!errors.recipientSurname?.message}
                                    disabled={isRecipientMySelf}
                                    label="نام خانوادگی گیرنده"
                                    value={field.value || ''}
                                    onBlur={field.onBlur}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <div className={"col-span-2"}>
                        <Controller
                            control={control}
                            name="recipientMobileNumber"
                            render={({field}) => (
                                <Input
                                    errorMessage={errors.recipientMobileNumber?.message}
                                    isInvalid={!!errors.recipientMobileNumber?.message}
                                    disabled={isRecipientMySelf}
                                    label="شماره موبایل"
                                    value={field.value || ''}
                                    onBlur={field.onBlur}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>
                <div className="flex justify-end gap-4">
                    <Button onClick={onBack} variant={"light"}>بازگشت</Button>
                    <Button isLoading={isLoading} onClick={handleSubmit(onSubmit)} color={"primary"}>ثبت</Button>
                </div>
            </ModalFooter>
        </ModalContent>
    )
}