import {
    Navbar as NextUINavbar,
    NavbarContent,
    NavbarMenu,
    NavbarBrand,
    NavbarItem,
    NavbarMenuItem,
} from "@nextui-org/navbar";
import {Button} from "@nextui-org/button";
import {Kbd} from "@nextui-org/kbd";
import {Input} from "@nextui-org/input";
import NextLink from "next/link";
import {useRouter} from 'next/router'

import {siteConfig} from "@/config/site";
import {ThemeSwitch} from "@/components/theme-switch";
import {
    TwitterIcon,
    GithubIcon,
    DiscordIcon,
    HeartFilledIcon,
    SearchIcon,
    Logo,
} from "@/components/icons";
import {UInput} from "@/components/base/input";
import {UButton} from "@/components/base/button/button";
import {UIcon} from "@/components/base/icon";
import {UBadge} from "@/components/base/badge/button";
import {UPopover, UPopoverContent, UPopoverTrigger} from "@/components/base/popover";
import {UTab, UTabs} from "@/components/base/tabs/tabs";
import {Tab, Tabs} from "@nextui-org/tabs";
import React, {useContext, useEffect, useState} from "react";
import api from "@/services/useApi";
import {GetMenuResult} from "@/services/digimal";
import {Profile} from "@/components/pages/layout/profile";
import {Badge} from "@nextui-org/badge";

export const Navbar = () => {
    const router = useRouter()
    const onLogin = () => {
        router.push('auth/login')
    }
    const [menu, setMenu] = useState<GetMenuResult[]>([])

    const fetchMenu = async () => {
        const {data} = await api.MenuApi.apiServicesAppMenuGetAllGet()
        setMenu(data.result)
    }
    useEffect(() => {
        fetchMenu();
    }, []);
    const searchInput = (
        <UInput
            aria-label="جستجو"
            classNames={{
                inputWrapper: "bg-default-100 w-96",
                input: "text-sm",
            }}
            endContent={
                <Kbd className="hidden lg:inline-block" keys={["command"]}>
                    K
                </Kbd>
            }
            labelPlacement="outside"
            placeholder="محصول مورد نظر را جستحو کنید"
            startContent={
                <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0"/>
            }
            size="lg"
            type="search"
        />
    );
    const [selected, setSelected] = React.useState("login");
    return (
        <>
            <NextUINavbar position="static" isBlurred={false} key="1" maxWidth="xl">
                <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                    <NavbarBrand className="gap-3 max-w-fit">
                        <NextLink className="flex justify-start items-center gap-1" href="/">
                            <Logo/>
                            <p className="font-bold text-inherit">پرومال</p>
                        </NextLink>
                    </NavbarBrand>
                    <NavbarItem className="lg:flex">{searchInput}</NavbarItem>
                </NavbarContent>
                <NavbarContent
                    justify="end"
                >
                    <ThemeSwitch/>
                    <Profile onLogin={onLogin}/>
                    <Badge content="5" color="danger" placement="bottom-right">
                        <Button variant="ghost" isIconOnly
                                 endContent={<UIcon className="text-xl" icon="tabler:basket"/>}>
                        </Button>
                    </Badge>
                </NavbarContent>
            </NextUINavbar>
            <NextUINavbar position="static" isBordered isBlurred={false} key="1" maxWidth="xl">
                <NavbarContent justify="start">
                    <UPopover
                        backdrop="blur"
                        placement="bottom"
                    >
                        <UPopoverTrigger>
                            <Button variant="light" size="lg" startContent={<UIcon icon="tabler:category"/>}>
                                دسته بندی
                            </Button>
                        </UPopoverTrigger>
                        <UPopoverContent className="p-0">
                            <div className="flex">
                                <UTabs aria-label="Tabs" isVertical color="primary">
                                    {menu?.map((item) => (
                                        <Tab title={item.persianName}/>
                                    ))}
                                </UTabs>
                                <div className="p-2">
                                    salam
                                </div>
                            </div>
                        </UPopoverContent>
                    </UPopover>
                </NavbarContent>
            </NextUINavbar>
        </>
    );
};
