// pages/index.tsx
import DefaultLayout from "@/layouts/default";
import {Render} from "@measured/puck";
import conf from "@/components/builder/config";
import api from "@/services/useApi";
import Head from "next/head";
import {RenderBuilder} from "@/components/builder/renderBuilder";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {Input} from "@nextui-org/input";
import {fetch} from "next/dist/compiled/@edge-runtime/primitives";
import axios from "axios";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

type Props = {
    initialData: any;
};

export default function IndexPage({initialData}: Props) {
    const router = useRouter()
    const [inputSell, setInputSell] = useState('')
    const [loadingSell, setLoadingSell] = useState(false)
    const [symbolSell, setSymbolSell] = useState([])
    const [valueSell, setValueSell] = useState()
    const [nowPriceSell, setNowPriceSell] = useState({})
    const [countSell, setCountSell] = useState(0)
    const [priceSell, setPriceSell] = useState(0)

    const [inputBuy, setInputBuy] = useState('')
    const [loadingBuy, setLoadingBuy] = useState(false)
    const [symbolBuy, setSymbolBuy] = useState([])
    const [valueBuy, setValueBuy] = useState()
    const [nowPriceBuy, setNowPriceBuy] = useState({})
    const [countBuy, setCountBuy] = useState(0)
    const [priceBuy, setPriceBuy] = useState(0)
    const fetchAllSymboles = async (symbol: string = '') => {
        try {
            const res = await axios.get(`/api/tsetmc?symbol=${encodeURIComponent(symbol)}`);
            return res.data?.instrumentSearch
        } catch (e) {
            console.error(e);
        }
    };
    const fetchDetailsSymboles = async (symbol: number) => {
        try {
            const res = await axios.get(`/api/tsetmcDetails?symbol=${encodeURIComponent(symbol)}`);
            return res.data?.closingPriceInfo
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (inputSell) {
            (async () => {
                setLoadingSell(true)
                setSymbolSell(await fetchAllSymboles(inputSell));
                setLoadingSell(false)
            })();
        }
    }, [inputSell]);

    useEffect(() => {
        if (inputBuy) {
            (async () => {
                setLoadingBuy(true)
                setSymbolBuy(await fetchAllSymboles(inputBuy));
                setLoadingBuy(false)
            })();
        }
    }, [inputBuy]);

    useEffect(() => {
        if (!valueBuy) return;

        let intervalId = setInterval(() => {
            fetchDetailsSymboles(valueBuy).then(setNowPriceBuy);
        }, 2000);

        // پاکسازی تایمر موقع تغییر valueBuy یا Unmount
        return () => clearInterval(intervalId);
    }, [valueBuy]);

    useEffect(() => {
        if (!valueSell) return;

        let intervalId = setInterval(() => {
            fetchDetailsSymboles(valueSell).then(setNowPriceSell);
        }, 2000);

        return () => clearInterval(intervalId);
    }, [valueSell]);
    return (
        <DefaultLayout>
            <Head>
                <title>عنوان صفحه – وب‌سایت من</title>
                <meta name="description" content="توضیحات صفحه برای موتورهای جستجو…"/>
                {/* بقیه متا تگ‌ها / Open Graph */}
            </Head>

            {/* چون initialData از سرور رسیده، Render خروجی‌اش در HTML اولیه قرار می‌گیرد */}
            {/*<RenderBuilder initialData={initialData} />*/}

            <div className={"flex w-full"}>
                <div className={'bg-success p-4 w-full'}>
                    <p className={"text-5xl text-center"}>خرید</p>
                    <div className={"flex gap-4"}>
                        <Autocomplete label={"نماد"} onInputChange={setInputBuy} isLoading={loadingBuy} onSelectionChange={setValueBuy}>
                            {symbolBuy.map(item => (
                                <AutocompleteItem key={item?.insCode}>{item?.lVal18AFC}</AutocompleteItem>
                            ))}
                        </Autocomplete>
                        <Input onValueChange={setPriceBuy} type={"number"} label={"قیمت"}/>
                        <Input onValueChange={setCountBuy} type={"number"} label={"تعداد"}/>
                    </div>
                    <p className={"text-9xl text-center"}>{((nowPriceBuy?.pDrCotVal - priceBuy) * countBuy)?.toLocaleString()}</p>
                </div>
                <div className={'bg-danger p-4 w-full'}>
                    <p className={"text-5xl text-center"}>فروش</p>
                    <div className={"flex gap-4"}>
                        <Autocomplete label={"نماد"} onInputChange={setInputSell} isLoading={loadingSell} onSelectionChange={setValueSell}>
                            {symbolSell.map(item => (
                                <AutocompleteItem key={item?.insCode}>{item?.lVal18AFC}</AutocompleteItem>
                            ))}
                        </Autocomplete>
                        <Input onValueChange={setPriceSell} type={"number"} label={"قیمت"}/>
                        <Input onValueChange={setCountSell} type={"number"} label={"تعداد"}/>
                    </div>
                    <p className={"text-9xl text-center"}>{((priceSell - nowPriceSell?.pDrCotVal) * countSell)?.toLocaleString()}</p>
                </div>
            </div>
        </DefaultLayout>
    );
}

export async function getServerSideProps(context: any) {
    try {
        const pageName = "home";
        const {data}: any = await api.PageBuilderApi.apiServicesAppPageBuilderGetByNameGet(pageName);
        const initialData = data.result
            ? JSON.parse(data.result.jsonContent)
            : {};
        return {
            props: {
                initialData,
            },
        };
    } catch (error) {
        console.error(error);
        return {
            props: {
                initialData: {},
            },
        };
    }
}
