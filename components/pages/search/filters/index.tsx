import {UCard, UCardBody, UCardHeader} from "@/components/base/card";
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import {Listbox, ListboxItem} from "@nextui-org/listbox";
import React, {useEffect, useState} from "react";
import _ from "lodash";
import {Checkbox, Slider} from "@nextui-org/react";
import {useRouter} from "next/router";

interface FiltersProductProps {
    filters: any
}
interface IAccordionProps {
    component: React.ReactNode,
    label: string,
}
export const FiltersProduct = (props: FiltersProductProps) =>{
    const [accordion,setAccordion] = useState<IAccordionProps[]>([])
    const generateFilters = () => {
        setAccordion([])
        if (props.filters?.productPriceRange?.minPrice || props.filters?.productPriceRange?.maxPrice) {
            setAccordion((prevState)=> [...prevState,{
                label: 'قیمت',
                component: <PriceFilter {...props.filters?.productPriceRange}/>,
            }])
        }
        if (props.filters?.brands) {
            setAccordion((prevState)=> [...prevState,{
                label: 'برند ها',
                component: <BrandFilter items={props.filters?.brands} queryKey='brandIds'/>,
            }])
        }
        if (props.filters?.productTypes) {
            setAccordion((prevState)=>[...prevState,{
                label: 'دسته بندی ها',
                component: <BrandFilter items={props.filters?.productTypes} queryKey='propertyIds'/>,
            }])
        }
        const groupSpec = _.groupBy(props.filters?.specifications,'title')
        Object.keys(groupSpec).map((i,index)=>{
            setAccordion((prevState)=>[...prevState,{
                label: i,
                component: <BrandFilter items={props.filters?.brands} queryKey='specificationIds'/>,
            }])
        })
    }
    useEffect(()=>{
        generateFilters()
    },[props.filters])
    return(
        <UCard>
            <UCardHeader>فیلترها</UCardHeader>
            <UCardBody>
                <Accordion>
                    {accordion.map((item,index) =>(
                        <AccordionItem key={`filters-${index}`} aria-label={item.label} title={item.label}>
                            {item.component}
                        </AccordionItem>
                    ))}
                </Accordion>
            </UCardBody>
        </UCard>
    )
}

interface BrandFilterProps {
    items:any[],
    queryKey?: string
}
const BrandFilter = (props:BrandFilterProps) =>{
    const router = useRouter()
    const [selectedKeys, setSelectedKeys] = React.useState([router.query?.[props.queryKey || ''] || '']);

    const selectedValue = React.useMemo(
        () => {
            const values = Array.from(selectedKeys).join(", ")
            if (props.queryKey){
                router.replace({
                    query:{
                        ...router.query,
                        [props.queryKey]: values
                    }
                })
            }
            return values
        },
        [selectedKeys]
    );
    return(
        <Listbox
            className="text-justify"
            aria-label="Single selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
        >
            {props.items.map((item) =>(
                <ListboxItem
                    classNames={{
                        selectedIcon: 'w-3 h-[1.1875rem]'
                    }}
                    selectedIcon={
                    <Checkbox className='p-0' isSelected={selectedValue == item.id}/>
                }
                    key={item.id} >{item.persianName}</ListboxItem>
            ))}
        </Listbox>
    )
}
interface PriceFilterProps {
    maxPrice: number,
    minPrice: number
}
const PriceFilter = (props: PriceFilterProps) =>{
    const router = useRouter()
    const [price,setPrice] = useState([router.query?.minPrice || props.minPrice, router.query?.maxPrice || props.maxPrice])
    const onChangeEndPrice = () =>{
        router.replace({
            query:{
                ...router.query,
                minPrice: price[0],
                maxPrice: price[1]
            }
        })
    }
    return(
        <Slider
            dir='rtl'
            label="بازه قیمت"
            step={1}
            minValue={props.minPrice}
            maxValue={props.maxPrice}
            value={price}
            formatOptions={{maximumSignificantDigits: 3 }}
            className="max-w-md"
            onChange={setPrice}
            onChangeEnd={onChangeEndPrice}
        />
    )
}