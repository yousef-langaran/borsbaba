import {Link} from "@nextui-org/link";

import {Head} from "./head";

import {Navbar} from "@/components/navbar";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/redux/store";
import {checkToken} from "@/redux/reducers/auth";
import {Footer} from "@/components/layout/footer";

export default function DefaultLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    const dispatch: AppDispatch = useDispatch()
    useEffect(() => {
        dispatch(checkToken())
    }, [])
    return (
        <div className="relative flex flex-col h-screen">
            <Head/>
            <Navbar/>
            {/*  container mx-auto max-w-8xl px-4 */}
            <main className="pt-20 flex-grow md:px-6 md:pt-36">
                {children}
            </main>
            <Footer/>
        </div>
    );
}
