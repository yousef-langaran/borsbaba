import {FiltersProduct} from "@/components/pages/search/filters";
import {UCard, UCardBody} from "@/components/base/card";
import {UImage} from "@/components/base/image/image";
import {useEffect, useState} from "react";
import api from "@/services/useApi";
import {useRouter} from "next/router";
import {GetProductsFilterByUserResultInfo} from "@/services/digimal";

export const PageSearch = () => {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(false)
    const [resultProduct, setResultProduct] = useState(null)
    const fetchProducts = async () => {
        try {
            setIsLogin(true)
            const {data} = await api.ProductApi.apiServicesAppProductFilterByUserPost({
                brandIds: router.query?.brand ? router.query?.brand?.split(',') : [],
                productTypeIds: router.query?.productType ? router.query?.productType?.split(',') : [],
                propertyIds: [],
                specificationIds: router.query?.specificationIds ? router.query?.specificationIds?.split(',') : [],
                maxPrice: 999999999,
                minPrice: 0,
                pageIndex: 1,
                pageSize: 25,
                phrase: '',
                sortColumnType: router.query?.sort ? router.query?.sort : 0
            })
            const {result}: any = data as GetProductsFilterByUserResultInfo
            setResultProduct(result)
            // products.value = result.productsList.productsInfo
            // totalCount.value = result.productsList.totalCount
            // filters.value = result.filters
            // sorts.value = result.sorts
            setIsLogin(false)
        } catch (e) {
            setIsLogin(false)
            console.log(e)
        }
    }
    useEffect(()=>{
        fetchProducts()
    },[])
    return (
        <div className="flex gap-4">
            <div className="min-w-64">
                <FiltersProduct filters={resultProduct?.filters}/>
            </div>
            <div className="grow">
                <div className='products-list'>
                    {resultProduct?.productsList.productsInfo.map((item)=>(
                            <UCard isPressable>
                                <UCardBody>
                                    <UImage
                                        isZoomed
                                        alt="NextUI Fruit Image with Zoom"
                                        src={item?.mediaList?.[0]?.allMedias?.[0]?.url}
                                        className="aspect-square !w-full !max-w-full bg-blend-multiply"
                                        classNames={{wrapper: '!w-full !max-w-full'}}
                                    />
                                    <h2 className="text-ellipsis line-clamp-2">{item?.persianName}</h2>
                                </UCardBody>
                            </UCard>
                        ))}
                </div>
            </div>
        </div>
    )
}