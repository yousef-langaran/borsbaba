import {FiltersProduct} from "@/components/pages/search/filters";
import {useEffect, useState} from "react";
import api from "@/services/useApi";
import {useRouter} from "next/router";
import {GetFilterItemsAndProductsByUserResult} from "@/services/digimal";
import {ProductCard} from "@/components/core/product/productCard";
import {UTabs} from "@/components/base/tabs/tabs";
import {Tab, Tabs} from "@nextui-org/tabs";

export const PageSearch = () => {
    const router = useRouter()
    const [resultProduct, setResultProduct] = useState<GetFilterItemsAndProductsByUserResult | null>(null)
    const fetchProducts = async () => {
        try {
            const {data} = await api.ProductApi.apiServicesAppProductFilterByUserPost({
                brandIds: typeof router.query.brandIds === 'string' ? router.query.brandIds.split(',').map(Number) : [],
                productTypeIds: typeof router.query?.productTypeIds === 'string' ? router.query?.productTypeIds?.split(',').map(Number) : [],
                propertyIds: [],
                specificationIds: typeof router.query?.specificationIds === 'string' ? router.query?.specificationIds?.split(',').map(Number) : [],
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
        } catch (e) {
            console.error(e)
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
                <div className='flex justify-between items-center mb-4'>
                    <Tabs size='sm'>
                        { resultProduct?.sorts?.map((item,index)=>(
                            <Tab key={`sorts-${item.value}`} title={item.persianTitle}/>
                        ))
                        }
                    </Tabs>
                    <p className='text-xs'>{resultProduct?.productsList?.totalCount} کالا</p>
                </div>
                <div className='products-list'>
                    {Array.isArray(resultProduct?.productsList?.productsInfo) && resultProduct?.productsList?.productsInfo.map((item, index) => (
                        <ProductCard key={`product-${index}`} product={item}/>
                    ))}
                </div>
            </div>
        </div>
    )
}