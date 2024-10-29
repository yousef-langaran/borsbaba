import {UCard, UCardBody, UCardHeader} from "@/components/base/card";
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import {Listbox, ListboxItem} from "@nextui-org/listbox";
import React, {useEffect, useMemo, useState} from "react";
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
                component: <BrandFilter items={props.filters?.brands} queryKey='brandIds' selectionMode='multiple'/>,
            }])
        }
        if (props.filters?.productTypes) {
            setAccordion((prevState)=>[...prevState,{
                label: 'دسته بندی ها',
                component: <BrandFilter items={props.filters?.productTypes} queryKey='productTypeIds' selectionMode='single'/>,
            }])
        }
        const groupSpec = _.groupBy(props.filters?.specifications,'title')
        Object.keys(groupSpec).map((i,index)=>{
            setAccordion((prevState)=>[...prevState,{
                label: i,
                component: <SpecificationFilter items={groupSpec[i]} queryKey='specificationIds' selectionMode='multiple'/>,
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
    queryKey?: string,
    selectionMode?: 'single' | 'multiple'
}
const BrandFilter = (props:BrandFilterProps) =>{
    const router = useRouter()
    const queryValue = router.query[props.queryKey || ''] as string | undefined;

    const [selectedKeys, setSelectedKeys] = React.useState<any>(queryValue ? queryValue.split(',') : []);

    const selectedValue = React.useMemo(
        () => {
            const values = Array.from(selectedKeys).join(",")
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
            selectionMode={props.selectionMode}
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
        >
            {props.items.map((item) =>(
                <ListboxItem
                    classNames={{
                        selectedIcon: 'w-3 h-[1.1875rem]'
                    }}
                    selectedIcon={
                    <Checkbox className='p-0' isSelected={Array.from(selectedKeys).includes(item.id.toString())}/>
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
    const [price,setPrice] = useState<any>([router.query?.minPrice || props.minPrice, router.query?.maxPrice || props.maxPrice])
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

interface SpecificationFilterProps {
    items:any[],
    queryKey?: string,
    selectionMode?: 'single' | 'multiple'
}
const SpecificationFilter = (props:SpecificationFilterProps) =>{
    const router = useRouter()
    //set first value
    useEffect(() => {
        if (!router.isReady || !router.query?.specificationIds || !props.items) return;
        const spec = typeof router.query.specificationIds === 'string'
            ? router.query.specificationIds.split(',')
            : [];
        const values = spec.reduce((selected: any[], id: string) => {
            const findItem = props.items.find((item: any) => +item?.id === +id);
            if (findItem) {
                selected.push(findItem);
            }
            return selected;
        }, []);
        setSelectedKeys(values.map(i => i.id) as any)
    }, [router.isReady, router.query?.specificationIds, props.items]);
    const [selectedKeys, setSelectedKeys] = React.useState<any>([]);

    const selectedValue = React.useMemo(
        () => {
            const values = Array.from(selectedKeys).join(", ")
            return values
        },
        [selectedKeys]
    );
    useEffect(() => {
        const specs = typeof router.query.specificationIds === 'string'
            ? router.query.specificationIds.split(',')
            : [];
        const mergedArray:any = [...specs, ...Array.from(selectedKeys)].reduce((acc:any, current) => {
            const x = acc.find((item:any) => item == current);
            if (!x) {
                // @ts-ignore
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);
        router.replace({query: {...router.query, specificationIds: mergedArray.join(',')}})
    }, [selectedKeys]);
    return(
        <Listbox
            className="text-justify"
            aria-label="Single selection example"
            variant="flat"
            selectionMode='multiple'
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
        >
            {props.items.map((item) =>(
                <ListboxItem
                    classNames={{
                        selectedIcon: 'w-3 h-[1.1875rem]'
                    }}
                    selectedIcon={
                        <Checkbox className='p-0' isSelected={Array.from(selectedKeys).includes(item.id.toString())}/>
                    }
                    key={item.id}>{item.value}</ListboxItem>
            ))}
        </Listbox>
    )
}