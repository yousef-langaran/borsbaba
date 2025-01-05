"use"

import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react"
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
import '@neshan-maps-platform/ol/ol.css';

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

const Step1 = ({ onNext, onClose, onApi }: Step1Props) => {
    useEffect(() => {
        let mapInstance: any;
        let markerLayer: any;

        import('@neshan-maps-platform/ol/Map').then(async ({ default: Map }) => {
            const { default: View } = await import('@neshan-maps-platform/ol/View');
            const { fromLonLat, toLonLat } = await import('@neshan-maps-platform/ol/proj');
            const { default: VectorLayer } = await import('@neshan-maps-platform/ol/layer/Vector');
            const { default: VectorSource } = await import('@neshan-maps-platform/ol/source/Vector');
            const { default: Feature } = await import('@neshan-maps-platform/ol/Feature');
            const { default: Point } = await import('@neshan-maps-platform/ol/geom/Point');
            const { default: Style } = await import('@neshan-maps-platform/ol/style/Style');
            const { default: Icon } = await import('@neshan-maps-platform/ol/style/Icon');
            const { default: Text } = await import('@neshan-maps-platform/ol/style/Text');
            const { default: Fill } = await import('@neshan-maps-platform/ol/style/Fill');
            const { default: Stroke } = await import('@neshan-maps-platform/ol/style/Stroke');
            // ایجاد یک لایه برداری برای مارکرها
            const vectorSource = new VectorSource();
            markerLayer = new VectorLayer({
                source: vectorSource,
            });

            // ایجاد نقشه
            mapInstance = new Map({
                maptype: 'neshan',
                target: 'map',
                key: mapKey,
                poi: true,
                traffic: true,
                layers: [markerLayer],
                view: new View({
                    center: fromLonLat([51.389, 35.6892]),
                    zoom: 14,
                }),
            });

            // افزودن رویداد کلیک
            mapInstance.on('click', async (event: any) => {
                const coordinates = event.coordinate;
                const [longitude, latitude] = toLonLat(coordinates);

                // ایجاد مارکر جدید با متن
                const markerFeature = new Feature({
                    geometry: new Point(coordinates),
                });

                // پاک کردن مارکرهای قبلی و افزودن مارکر جدید
                vectorSource.clear();
                vectorSource.addFeature(markerFeature);

                // انجام عملیات معکوس جغرافیایی
                const reverseGeocodingData = await reverseGeocoding(latitude, longitude);
                markerFeature.setStyle(
                    new Style({
                        image: new Icon({
                            src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // آدرس تصویر مارکر
                            anchor: [0.5, 1],
                            scale: 0.05,
                        }),
                        text: new Text({
                            text: reverseGeocodingData?.formatted_address, // متن بالای مارکر
                            font: '12px iranyekan',
                            backgroundFill: new Fill({ color: '#fff' }),
                            fill: new Fill({ color: '#000' }), // رنگ متن
                            stroke: new Stroke({ color: '#fff', width: 2 }), // رنگ و عرض حاشیه
                            offsetY: -40, // فاصله متن از مارکر
                        }),
                    })
                );
            });
        });

        return () => {
            if (mapInstance) {
                mapInstance.setTarget(null); // پاک کردن نقشه
            }
        };
    }, []);

    const reverseGeocoding = async (lat: string | number, lng: string | number) => {
        try {
            const { data } = await axios.get(`https://api.neshan.org/v4/reverse?lat=${lat}&lng=${lng}`, {
                headers: { "Api-Key": serviceKey },
            });
            onApi?.({ ...data, lat, lng });
            return data
        } catch (error) {
            console.error("Reverse geocoding error:", error);
        }
    };

    return (
        <ModalContent>
            <ModalHeader>
                <div>
                    <h2 className="font-bold">انتخاب آدرس روی نقشه</h2>
                </div>
            </ModalHeader>
            <ModalBody>
                <div className="w-full h-96 rounded-xl overflow-hidden">
                    <div id="map" style={{ width: "100%", height: "400px" }}></div>
                </div>
            </ModalBody>
            <ModalFooter>
                <div className="flex justify-end gap-4">
                    <Button variant="light" onClick={onClose}>
                        بستن
                    </Button>
                    <Button color="primary" onClick={onNext}>
                        تایید و ادامه
                    </Button>
                </div>
            </ModalFooter>
        </ModalContent>
    );
};



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