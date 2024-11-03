import { Link } from "@nextui-org/link";

import { Head } from "./head";

import { Navbar } from "@/components/navbar";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/redux/store";
import {checkToken} from "@/redux/reducers/auth";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const dispatch: AppDispatch = useDispatch()
    useEffect(()=>{
        dispatch(checkToken())
    },[])
  return (
    <div className="relative flex flex-col h-screen">
      <Head />
      <Navbar />
      <main className="container mx-auto max-w-7xl p-4 flex-grow md:px-6 md:pt-32">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://nextui-docs-v2.vercel.app?utm_source=next-pages-template"
          title="nextui.org homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">Promal</p>
        </Link>
      </footer>
    </div>
  );
}
