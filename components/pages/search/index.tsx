import {FiltersProduct} from "@/components/pages/search/filters";
import {useEffect, useState} from "react";
import api from "@/services/useApi";
import {useRouter} from "next/router";
import {GetFilterItemsAndProductsByUserResult} from "@/services/digimal";
import {ProductCard} from "@/components/core/product/productCard";

export const PageSearch = () => {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(false)
    const [resultProduct, setResultProduct] = useState<GetFilterItemsAndProductsByUserResult | null>(null)
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
                sortColumnType: router.query?.sort ? router.query?.sort : 0 as any
            })
            const {result}: any = data as GetFilterItemsAndProductsByUserResult
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
    useEffect(() => {
        fetchProducts()
    }, [])
    return (
        <div className="flex gap-4">
            <div className="min-w-64">
                <FiltersProduct filters={resultProduct?.filters}/>
            </div>
            <div className="grow">
                <div className='products-list'>
                    {Array.isArray(resultProduct?.productsList?.productsInfo) && resultProduct?.productsList?.productsInfo.map((item,index) => (
                        <ProductCard key={`product-${index}`} product={item}/>
                    ))}
                </div>
            </div>
        </div>
    )
}