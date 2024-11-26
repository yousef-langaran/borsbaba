import {
    Navbar as NextUINavbar,
    NavbarContent,
    NavbarBrand,
    NavbarItem,
} from "@nextui-org/navbar";
import {Button} from "@nextui-org/button";
import {Kbd} from "@nextui-org/kbd";
import NextLink from "next/link";
import {useRouter} from 'next/router'

import {ThemeSwitch} from "@/components/theme-switch";
import {
    SearchIcon,
    Logo,
} from "@/components/icons";
import {UInput} from "@/components/base/input";
import {UIcon} from "@/components/base/icon";
import {UPopover, UPopoverContent, UPopoverTrigger} from "@/components/base/popover";
import {UTabs} from "@/components/base/tabs/tabs";
import {Tab} from "@nextui-org/tabs";
import React, {useEffect, useState} from "react";
import {Profile} from "@/components/pages/layout/profile";
import {Badge} from "@nextui-org/badge";
import {useSelector, useDispatch} from 'react-redux';
import {fetchMenu} from "@/redux/reducers/menu";
import {AppDispatch, RootState} from "@/redux/store";
import {UCard} from "@/components/base/card";
import {UButton} from "@/components/base/button/button";
import {Icon} from "@iconify/react";
import {getBasket} from "@/redux/reducers/basket";
import {CategoryPopup} from "@/components/core/category";
import {BasketPopover} from "@/components/layout/basket";

const bottomNav = [
    {
        icon: 'hugeicons:home-03',
        label: 'خانه',
        route: '/'
    },
    {
        icon: 'hugeicons:dashboard-square-01',
        label: 'دسته بندی ها',
        route: '/categories'
    },
    {
        icon: 'hugeicons:shopping-basket-03',
        label: 'سبد خرید',
        route: '/basket'
    },
    {
        icon: 'hugeicons:user',
        label: 'پروفایل',
        route: '/profile'
    },
]
export const Navbar = () => {
    const router = useRouter()
    const [phrase, setPhrase] = useState('')
    const onLogin = () => {
        router.push('auth/login')
    }

    const dispatch: AppDispatch = useDispatch()
    const menuItems = useSelector((state: RootState) => state.menu.items)

    useEffect(() => {
        dispatch(fetchMenu());
        dispatch(getBasket())
    }, []);

    const [scrollDirection, setScrollDirection] = useState<string | null>(null);
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
    const onGoSearchPage = (event: any) => {
        if (event.key === 'Enter') {
            router.push({pathname: 'search', query: {q: phrase}})
        }
    }
    const searchInput = (
        <UInput
            aria-label="جستجو"
            classNames={{
                inputWrapper: "bg-default-100",
                input: "text-sm",
            }}
            onKeyDown={onGoSearchPage}
            endContent={
                <Kbd className="hidden lg:inline-block" keys={["command"]}>
                    K
                </Kbd>
            }
            onValueChange={setPhrase}
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
        <>
            <nav className='fixed w-full top-0 shadow z-50'>
                <NextUINavbar className='z-50 bg-content1' position='sticky' maxWidth="2xl">
                    <NavbarContent className="basis-1/5 sm:basis-full " justify="start">
                        <NavbarBrand className="gap-3 max-w-fit hidden md:flex">
                            <NextLink className="justify-start items-center gap-1 flex" href="/">
                                <Logo/>
                                <p className="font-bold text-inherit">پرومال</p>
                            </NextLink>
                        </NavbarBrand>
                        <NavbarItem className={"w-full"}>{searchInput}</NavbarItem>
                    </NavbarContent>
                    <NavbarContent
                        justify="end"
                        className={"hidden md:flex"}
                    >
                        <NavbarItem className="gap-4 flex">
                            <ThemeSwitch/>
                            <Profile onLogin={onLogin}/>
                            <BasketPopover/>
                        </NavbarItem>
                    </NavbarContent>
                </NextUINavbar>
                <NextUINavbar isBordered classNames={{wrapper: "mx-auto"}} className={[
                    scrollDirection === 'down' ? '-translate-y-full' : 'h-16',
                    'transition-all overflow-hidden absolute top-16 bg-content1 hidden md:block'
                ].join(' ')} maxWidth="2xl">
                    <CategoryPopup/>
                </NextUINavbar>
            </nav>
            <div className={"fixed bottom-0 w-full z-50 md:hidden"}>
                <UCard className={'rounded-none'}>
                    <div className={"flex justify-around h-14"}>
                        {bottomNav.map((item, index) => (
                            <UButton key={index} className={"w-full flex flex-col gap-1 h-full rounded-none"}
                                     color={router.pathname === item.route ? "primary" : "default"} variant={"light"}>
                                <Icon icon={item.icon} fontSize={25}/>
                                <span className={"text-xs font-bold"}>{item.label}</span>
                            </UButton>
                        ))}
                    </div>
                </UCard>
            </div>
        </>
    );
};
