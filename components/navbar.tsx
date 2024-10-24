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
import {useSelector, useDispatch} from 'react-redux';
import {fetchMenu} from "@/redux/reducers/menu";
import {AppDispatch, RootState} from "@/redux/store";

export const Navbar = () => {
    const router = useRouter()
    const onLogin = () => {
        router.push('auth/login')
    }

    const dispatch: AppDispatch = useDispatch()
    const menuItems = useSelector((state: RootState) => state.menu.items)
    useEffect(() => {
        dispatch(fetchMenu());
    }, []);

    const [scrollDirection, setScrollDirection] = useState(null);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
            setScrollDirection('down');
        } else if (currentScrollY < lastScrollY) {
            setScrollDirection('up');
        }

        setLastScrollY(currentScrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

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
    return (
        <nav className='sticky top-0 shadow z-50' >
            <NextUINavbar className='z-50 bg-content1' position='sticky' maxWidth="2xl">
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
                        <NavbarItem className="flex gap-4">
                            <ThemeSwitch/>
                            <Profile onLogin={onLogin}/>
                            <Badge content="5" color="danger" placement="bottom-right">
                                <Button variant="ghost" isIconOnly
                                        endContent={<UIcon className="text-xl" icon="tabler:basket"/>}>
                                </Button>
                            </Badge>
                        </NavbarItem>
                    </NavbarContent>
            </NextUINavbar>
            <NextUINavbar isBordered className={[scrollDirection === 'down' ? '-translate-y-full' : 'h-16','transition-all overflow-hidden absolute top-16 bg-content1']} maxWidth="2xl">
                <NavbarContent justify='start'>
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
                                    {menuItems?.map((item,index) => (
                                        <Tab key={`menuTab-${index}`} title={item.persianName}/>
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
        </nav>
    );
};
