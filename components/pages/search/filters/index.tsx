import {UCard, UCardBody, UCardHeader} from "@/components/base/card";
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import {Listbox, ListboxItem} from "@nextui-org/listbox";
import React from "react";

interface FiltersProductProps {
    filters: any
}
export const FiltersProduct = (props: FiltersProductProps) =>{
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", "),
        [selectedKeys]
    );
    return(
        <UCard>
            <UCardHeader>فیلترها</UCardHeader>
            <UCardBody>
                <Accordion>
                    <AccordionItem key="1" aria-label="Accordion 1" title="Accordion 1">
                        <Listbox
                            className="text-justify"
                            aria-label="Single selection example"
                            variant="flat"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={selectedKeys}
                            onSelectionChange={setSelectedKeys}
                        >
                            <ListboxItem key="text">موبایل</ListboxItem>
                            <ListboxItem key="number">کامپیوتر</ListboxItem>
                            <ListboxItem key="date">Date</ListboxItem>
                            <ListboxItem key="single_date">موس</ListboxItem>
                            <ListboxItem key="iteration">کیبورد</ListboxItem>
                        </Listbox>
                    </AccordionItem>
                </Accordion>
            </UCardBody>
        </UCard>
    )
}