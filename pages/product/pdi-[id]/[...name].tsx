import DefaultLayout from "@/layouts/default";
import api from "@/services/useApi";
import React, {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/router";
import {BreadcrumbItem, Breadcrumbs, cn, Radio, RadioGroup} from "@nextui-org/react";
import {GetProductDetailsResult} from "@/services/digimal";
import {Icon} from "@iconify/react";
import {Link} from "@nextui-org/link";
import {ResellerInformation} from "@/components/pages/product/resellerInformation";
import {ImageGallery} from "@/components/core/gallary";

export default function IndexPage() {
    const router = useRouter()
    const [product, setProduct] = useState<GetProductDetailsResult>({})
    const [property, setProperty] = useState<any>(null)
    const productGetById = () => {
        const PID = router?.query?.id && +router?.query?.id.toString().split('-')[1]
        if (PID)
            api.ProductApi.apiServicesAppProductGetByIdGet(PID).then((res: any) => {
                setProduct(res.data.result as GetProductDetailsResult)
                setProperty(res.data.result?.resellers && res.data.result?.resellers[0].productPropertyId)
            })
    }
    const getResellers = useMemo(() => {
        return product?.resellers?.filter(i => i.productPropertyId === property)
    }, [product,property])
    useEffect(() => {
        productGetById()
    }, [router])
    return (
        <DefaultLayout>
            <div className="md:py-8">
                <Breadcrumbs separator="/"
                             itemClasses={{
                                 separator: "px-2"
                             }}>
                    <BreadcrumbItem href={"/"} key="home">پرومال</BreadcrumbItem>
                    {product.breadCrumbs?.map(item => (
                        <BreadcrumbItem href={`/search?productTypeIds=${item.id}`} key={`breadcrum-${item.id}`}>{item.persianName}</BreadcrumbItem>
                    ))}
                    <BreadcrumbItem>{product.persianName}</BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row">
                <div className="md:w-[450px]">
                    <ImageGallery data={product?.media as any}/>
                </div>
                <div className="w-full">
                    <div>
                        <h1 className="text-xl font-bold mb-5">{product?.persianName}</h1>
                    </div>
                    <div className="flex flex-col gap-4 lg:flex-row">
                        <div className="flex-grow">
                            <div className="flex items-center w-full text-sm text-gray-400 mb-2">
                                <span className="ml-2">{product?.englishName}</span>
                                <div className="flex-grow h-[1px] bg-gray-300"></div>
                            </div>
                            <div className="flex gap-5 flex-col">
                                <div className="text-sm flex items-center gap-1">
                                    <Icon icon="ph:star-fill" className="text-amber-500"/>
                                    <span>0.0</span>
                                    <span className="text-xs text-gray-400">(امتیاز 0 خریدار)</span>
                                    <Icon fontSize="15" className="text-gray-400" icon="fluent-mdl2:location-dot"/>
                                    <Link className="text-sm text-cyan-500">0 دیدگاه</Link>
                                    <Icon fontSize="15" className="text-gray-400" icon="fluent-mdl2:location-dot"/>
                                    <Link className="text-sm text-cyan-500">0 پرسش</Link>
                                </div>
                                {product?.properties && product.properties.length > 0 && (
                                    <div>
                                        <div className="text-xl mb-4">{product?.properties[0].title}: مشکی</div>
                                        <RadioGroup onValueChange={setProperty} value={property}>
                                            {product.properties.map((item:any)=>(
                                                <Radio
                                                    key={item.id}
                                                    value={item.id as any}
                                                    classNames={{
                                                        base: cn(
                                                            "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                                                            "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
                                                            "data-[selected=true]:border-primary border-default"
                                                        ),
                                                    }}
                                                >
                                                    {item.value}
                                                </Radio>
                                            ))}
                                        </RadioGroup>
                                        {/*<UColorSelect v-model="property" :data="data?.properties"/>*/}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="md:w-[400px] w-full">
                            <ResellerInformation resellers={getResellers}/>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}