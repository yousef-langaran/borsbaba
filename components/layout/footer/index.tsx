"use client";

import type {IconProps} from "@iconify/react";

import React from "react";
import {Button, Divider, Input, Link} from "@nextui-org/react";
import {Icon} from "@iconify/react";

import {AcmeIcon} from "./acme";
import ThemeSwitch from "./theme-switch";

type SocialIconProps = Omit<IconProps, "icon">;

const footerNavigation = {
    services: [
        {name: "با دیجی‌کالا", href: "#"},
        {name: "اتاق خبر دیجی‌کالا", href: "#"},
        {name: "فروش در دیجی‌کالا", href: "#"},
        {name: "فرصت‌های شغلی", href: "#"},
        {name: "گزارش تخلف در دیجی‌کالا", href: "#"},
        {name: "تماس با دیجی‌کالا", href: "#"},
        {name: "درباره دیجی‌کالا", href: "#"},
    ],
    supportOptions: [
        {name: "پاسخ به پرسش‌های متداول", href: "#"},
        {name: "رویه‌های بازگرداندن کالا", href: "#"},
        {name: "شرایط استفاده", href: "#"},
        {name: "حریم خصوصی", href: "#"},
        {name: "گزارش باگ", href: "#"},
    ],
    aboutUs: [
        {name: "نحوه ثبت سفارش", href: "#"},
        {name: "رویه ارسال سفارش", href: "#"},
        {name: "شیوه‌های پرداخت", href: "#"},
    ],
    social: [
        {
            name: "Facebook",
            href: "#",
            icon: (props: SocialIconProps) => <Icon {...props} icon="fontisto:facebook"/>,
        },
        {
            name: "Instagram",
            href: "#",
            icon: (props: SocialIconProps) => <Icon {...props} icon="fontisto:instagram"/>,
        },
        {
            name: "Twitter",
            href: "#",
            icon: (props: SocialIconProps) => <Icon {...props} icon="fontisto:twitter"/>,
        },
        {
            name: "GitHub",
            href: "#",
            icon: (props: SocialIconProps) => <Icon {...props} icon="fontisto:github"/>,
        },
    ],
    promal: ['تلفن پشتیبانی ۶۱۹۳۰۰۰۰ - ۰۲۱', 'تلفن پشتیبانی ۶۱۹۳۰۰۰۰ - ۰۲۱', '۷ روز هفته، ۲۴ ساعته پاسخگوی شما هستیم']
};

export const Footer = () => {
    const renderList = React.useCallback(
        ({title, items}: { title: string; items: { name: string; href: string }[] }) => (
            <div>
                <h3 className="text-small font-semibold text-default-600">{title}</h3>
                <ul className="mt-6 space-y-4">
                    {items.map((item) => (
                        <li key={item.name}>
                            <Link className="text-default-400" href={item.href} size="sm">
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        ),
        [],
    );

    return (
        <footer className="flex w-full flex-col border-t mt-16">
            <div className="px-6 pb-8 pt-8 sm:pt-8 lg:px-8 lg:pt-8 container mx-auto">
                <div className={"mb-10"}>
                    <div className="flex items-center justify-start">
                        <AcmeIcon size={44}/>
                        <span className="text-3xl font-bold">پرومال</span>
                    </div>
                    <div className={"flex gap-4 h-5 items-center"}>
                        {footerNavigation.promal.map((item,index) => (
                            <>
                                <p className={"text-xs"}>{item}</p>
                                {(index !== footerNavigation.promal.length-1) &&
                                <Divider orientation="vertical" className={"w-0.5"}/>
                                }
                            </>
                        ))}
                    </div>
                </div>

                <div className="md:grid md:grid-cols-4 md:gap-8">
                    <div>{renderList({title: "پرومال", items: footerNavigation.services})}</div>
                    <div className="mt-10 md:mt-0">
                        {renderList({title: "Support", items: footerNavigation.supportOptions})}
                    </div>
                    <div>{renderList({title: "About Us", items: footerNavigation.aboutUs})}</div>
                    <div className="space-y-8 md:pr-8">
                        <p className="text-small text-default-500">
                            همراه ما باشید!
                        </p>
                        <div className="flex gap-4">
                            {footerNavigation.social.map((item) => (
                                <Link key={item.name} isExternal className="text-default-400" href={item.href}>
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon aria-hidden="true" className="w-6" fontSize={30}/>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    className="my-10 rounded-medium bg-default-200/20 p-4 sm:my-14 sm:p-8 lg:my-16 lg:flex lg:items-center lg:justify-between lg:gap-2">
                    <div>
                        <h3 className="text-small font-semibold text-default-600">
                            با ثبت ایمیل، از جدید‌ترین تخفیف‌ها با‌خبر شوید
                        </h3>
                    </div>
                    <form className="mt-6 sm:flex sm:max-w-md lg:mt-0">
                        <Input
                            isRequired
                            aria-label="Email"
                            autoComplete="email"
                            id="email-address"
                            labelPlacement="outside"
                            name="email-address"
                            placeholder="promal@email.com"
                            startContent={<Icon className="text-default-500" icon="solar:letter-linear"/>}
                            type="email"
                        />
                        <div className="mt-4 sm:mr-4 sm:mt-0 sm:flex-shrink-0">
                            <Button color="primary" type="submit">
                                ثبت
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="flex flex-wrap justify-between gap-2 pt-8">
                    <p className="text-small text-default-400">&copy; 2024 برای استفاده از مطالب دیجی‌کالا، داشتن «هدف غیرتجاری» و ذکر «منبع» کافیست. تمام حقوق اين وب‌سايت نیز برای شرکت نوآوران فن آوازه (فروشگاه آنلاین دیجی‌کالا) است.</p>
                    <ThemeSwitch/>
                </div>
            </div>
        </footer>
    );
}
