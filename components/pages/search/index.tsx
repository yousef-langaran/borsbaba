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
                brandIds: router.query?.brandIds ? router.query?.brandIds?.split(',') : [],
                productTypeIds: router.query?.productTypeIds ? router.query?.productTypeIds?.split(',') : [],
                propertyIds: [],
                specificationIds: router.query?.specificationIds ? router.query?.specificationIds?.split(',') : [],
                maxPrice: router.query?.maxPrice ? +router.query?.maxPrice : undefined,
                minPrice: router.query?.minPrice ? +router.query?.minPrice : undefined,
                pageIndex: 1,
                pageSize: 25,
                phrase: router.query?.q ? router.query?.q.toString() : undefined,
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
        }
    }
    useEffect(() => {
        if (!router.isReady) return;
        fetchProducts()
    }, [router.isReady, JSON.stringify(router.query)])
    return (
        <div className="flex gap-4">
            <div className="min-w-64">
                <FiltersProduct filters={resultProduct?.filters}/>
            </div>
            <div className="grow">
                <div className='products-list'>
                    {Array.isArray(resultProduct?.productsList?.productsInfo) && resultProduct?.productsList?.productsInfo.map((item, index) => (
                        <ProductCard key={`product-${index}`} product={item}/>
                    ))}
                </div>
            </div>
        </div>
    )
}