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
    const onGoSearchPage = (event:any) =>{
        if (event.key === 'Enter'){
            router.push({pathname: 'search',query:{q: phrase}})
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
        <nav className='sticky top-0 shadow z-50' >
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
                            <Badge content="5" color="danger" placement="bottom-right">
                                <Button variant="ghost" isIconOnly
                                        endContent={<UIcon className="text-xl" icon="tabler:basket"/>}>
                                </Button>
                            </Badge>
                        </NavbarItem>
                    </NavbarContent>
            </NextUINavbar>
            <NextUINavbar isBordered className={[
                scrollDirection === 'down' ? '-translate-y-full' : 'h-16',
                'transition-all overflow-hidden absolute top-16 bg-content1 hidden md:block'
            ].join(' ')} maxWidth="2xl">
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
