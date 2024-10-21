import type {AppProps} from "next/app";

import {NextUIProvider} from "@nextui-org/system";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {useRouter} from "next/router";

import {fontSans, fontMono} from "@/config/fonts";
import "@/styles/globals.css";

import {Provider} from 'react-redux';
import store from '../redux/store';

export default function App({Component, pageProps}: AppProps) {
    const router = useRouter();

    return (
        <NextUIProvider navigate={router.push}>
            <NextThemesProvider>
                <Provider store={store}>
                    <Component {...pageProps} />
                </Provider>
            </NextThemesProvider>
        </NextUIProvider>
    );
}

export const fonts = {
    sans: fontSans.style.fontFamily,
    mono: fontMono.style.fontFamily,
};
