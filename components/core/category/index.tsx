import {UPopover, UPopoverContent, UPopoverTrigger} from "@/components/base/popover";
import {Button} from "@nextui-org/button";
import {UIcon} from "@/components/base/icon";
import {UTabs} from "@/components/base/tabs/tabs";
import {Tab} from "@nextui-org/react";
import {NavbarContent} from "@nextui-org/navbar";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";

export const CategoryPopup = () => {
    const menuItems = useSelector((state: RootState) => state.menu.items)
    const [selected, setSelected] = React.useState<any>("login");
    return (
        <NavbarContent justify='start'>
            <UPopover
                backdrop="blur"
                placement="bottom-end"
            >
                <UPopoverTrigger>
                    <Button variant="light" size="lg" startContent={<UIcon icon="tabler:category"/>}>
                        دسته بندی
                    </Button>
                </UPopoverTrigger>
                <UPopoverContent className="p-0">
                    <div className="flex">
                        <UTabs selectedKey={selected}
                               onSelectionChange={setSelected} classNames={{
                            wrapper: "max-h-[calc(100vh-350px)] w-screen container max-w-8xl",
                            panel: "overflow-auto w-full",
                            base: "overflow-auto"
                        }} onSelect={(e) => console.log(e)} aria-label="Tabs" isVertical color="primary">
                            {menuItems?.map((item, index) => (
                                <Tab key={`menuTab-${index}`} title={item.persianName}>
                                    <div className="p-2 md:p-4 columns-2 md:columns-3 lg:columns-4 gap-4 w-full">
                                        {Array.isArray(item?.children) && item?.children.map((child1, index1) => (
                                            <ul key={index1}
                                                className="text-primary break-inside-avoid text-xl cursor-pointer">
                                                <p className="my-3">
                                                    {child1?.persianName}
                                                </p>
                                                {Array.isArray(child1?.children) && child1?.children.map((child2, index2) => (
                                                    <li key={index2}
                                                        className="text-black hover:text-primary text-base py-1">
                                                        {child2?.persianName}
                                                    </li>
                                                ))}

                                            </ul>
                                        ))}
                                    </div>
                                </Tab>
                            ))}
                        </UTabs>
                    </div>
                </UPopoverContent>
            </UPopover>
        </NavbarContent>
    )
}