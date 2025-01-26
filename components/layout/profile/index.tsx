import DefaultLayout from "@/layouts/default";
import React from "react";
import {Listbox, ListboxItem} from "@nextui-org/listbox";
import {Chip, cn} from "@nextui-org/react";
import {Icon} from "@iconify/react";
import {Button} from "@nextui-org/button";

interface LayoutProfileProps {
    children?: React.ReactNode
}


export const IconWrapper = ({children, className}:any) => (
    <div className={cn(className, "flex items-center rounded-small justify-center w-7 h-7")}>
        {children}
    </div>
);

export const ItemCounter = ({number}: any) => (
    <div className="flex items-center gap-1 text-default-400">
        {number &&
            <Chip color={"danger"} size={"sm"} className="text-small">{number}</Chip>
        }
        <Icon icon={"solar:alt-arrow-left-broken"} className="text-xl"/>
    </div>
);

const menusList = [
    {
        label: 'خلاصه فعالیت ها',
        key: 'summary',
        icon: {
            name: 'solar:home-2-broken',
            class: 'bg-success/10 text-success'
        },
        href: '/'
    },
    {
        label: 'سفارش ها',
        key: 'order',
        icon: {
            name: 'solar:bag-4-broken',
            class: 'bg-primary/10 text-primary'
        },
        href: '/profile/order'
    },
    {
        label: 'لیست های من',
        key: 'lists',
        icon: {
            name: 'solar:heart-angle-broken',
            class: 'bg-danger/10 text-danger'
        },
        href: '/profile/lists'
    },
    {
        label: 'دیدگاه‌ها و پرسش‌ها',
        key: 'comments',
        icon: {
            name: 'solar:chat-square-broken',
            class: 'bg-warning/10 text-warning'
        },
        href: '/profile/comments'
    },
    {
        label: 'آدرس ها',
        key: 'addresses',
        icon: {
            name: 'solar:map-point-broken',
            class: 'bg-purple-700/10 text-purple-700'
        },
        href: '/profile/addresses'
    },
    {
        label: 'پیام ها',
        key: 'notification',
        icon: {
            name: 'solar:bell-broken',
            class: 'bg-orange-700/10 text-orange-700'
        },
        count: 61,
        href: '/profile/notification'
    },
    {
        label: 'بازدید های اخیر',
        key: 'user-history',
        icon: {
            name: 'solar:history-broken',
            class: 'bg-secondary/10 text-secondary'
        },
        href: '/profile/user-history'
    },
    {
        label: 'اطلاعات حساب کاربری',
        key: 'personal-info',
        icon: {
            name: 'solar:user-broken',
            class: 'bg-warning/10 text-warning'
        },
        href: '/profile/personal-info'
    },
    {
        label: 'خروج',
        key: 'logout',
        icon: {
            name: 'solar:logout-2-broken',
            class: 'bg-danger/10 text-danger'
        },
        href: '/profile/personal-info'
    },
]
export const LayoutProfile = ({children}: LayoutProfileProps) => {
    return (
        <DefaultLayout>
            <div className={"flex container mx-auto"}>
                <div className={'min-w-96'}>
                    <Listbox
                        aria-label="User Menu"
                        className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[300px] overflow-visible shadow-small rounded-medium"
                        itemClasses={{
                            base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 min-h-12 data-[hover=true]:bg-default-100/80",
                        }}
                    >
                        <ListboxItem>
                            <div className={"flex justify-between items-center py-4 border-b"}>
                                <div>
                                    <p className={"text-lg font-bold"}>یوسف لنگران طرقبه</p>
                                    <p>09351141940</p>
                                </div>
                                <Button isIconOnly size={"sm"} variant={"light"} color={"primary"}>
                                    <Icon icon={"solar:pen-2-broken"} fontSize={20}/>
                                </Button>
                            </div>
                        </ListboxItem>
                        <>
                            {
                                menusList.map(item => (
                                    <ListboxItem
                                        key={item.key}
                                        endContent={<ItemCounter number={item?.count}/>}
                                        startContent={
                                            <IconWrapper className={`${item.icon.class}`}>
                                                <Icon icon={item.icon.name} className="text-lg"/>
                                            </IconWrapper>
                                        }
                                    >
                                        {item.label}
                                    </ListboxItem>
                                ))
                            }
                        </>
                    </Listbox>
                </div>
                <div className={"grow"}>
                    {children}
                </div>
            </div>
        </DefaultLayout>
    )
}