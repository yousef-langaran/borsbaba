import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {useState} from "react";
import {Icon} from "@iconify/react";
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import {Image} from "@nextui-org/image";
import {ScrollShadow} from "@nextui-org/react";

interface PageCategoriesProps {

}

export const PageCategories = (props: PageCategoriesProps) => {
    const menuItems = useSelector((state: RootState) => state.menu.items)
    const [activeMenu, setActiveMenu] = useState<any>(null)
    return (
        <>
            <div className="flex h-[calc(100vh_-_(61px_+_95px))]">
                <ScrollShadow>
                    <div className="w-20 min-w-20 divide-y bg-gray-100 overflow-auto">
                        {menuItems.map((item, index) => (
                            <div key={index} onClick={() => setActiveMenu(item)}
                                 className={`h-20 flex flex-col gap-2 justify-center items-center ${activeMenu?.id === item?.id && "bg-white text-primary"}`}>
                                <Icon icon={"i-heroicons-cake"}/>
                                <p className="text-center text-xs">{item?.persianName}</p>
                            </div>
                        ))
                        }
                    </div>
                </ScrollShadow>
                <ScrollShadow className={"grow"}>
                    <div className=" overflow-auto">
                        <Accordion>
                            {activeMenu?.children.map((item: any, index: number) => (
                                <AccordionItem key={index} aria-label="Accordion 1" title={item?.persianName}>
                                    <div className="grid grid-cols-3 place-items-center gap-6">
                                        {item.children.map((menu: any) => (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-16 h-16 rounded-full bg-gray-200 p-3">
                                                    <Image
                                                        src={"https://dkstatics-public.digikala.com/digikala-mega-menu/c5214865679ce797bd3c1866936fe62879fd2759_1693213232.png"}/>
                                                </div>
                                                <p className="text-sm text-center">{menu?.persianName}</p>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </ScrollShadow>
            </div>
        </>

    )
}