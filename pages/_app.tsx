import type {AppProps} from "next/app";

import {NextUIProvider} from "@nextui-org/system";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {useRouter} from "next/router";

import {fontSans, fontMono} from "@/config/fonts";
import "@/styles/globals.css";

import {Provider} from 'react-redux';
import store from '../redux/store';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import {I18nextProvider} from "react-i18next";
import i18n from "@/plugins/i18n";

export default function App({Component, pageProps}: AppProps) {
    const router = useRouter();


    return (
        <NextUIProvider navigate={router.push}>
            <NextThemesProvider>
                <I18nextProvider i18n={i18n}>
                    <Provider store={store}>
                        {
                            // @ts-ignore
                            <Component {...pageProps} />
                        }
                    </Provider>
                </I18nextProvider>
            </NextThemesProvider>
        </NextUIProvider>
    );
}

export const fonts = {
    sans: fontSans.style.fontFamily,
    mono: fontMono.style.fontFamily,
};
