import DefaultLayout from "@/layouts/default";
import {Render} from "@measured/puck";
import conf from "@/components/builder/config";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import api from "@/services/useApi";
import {Calendar} from "@nextui-org/react";
import {I18nProvider} from "@react-aria/i18n";

export default function IndexPage() {
    const router = useRouter()
    const [initialData, setInitialData] = useState({})
    const [isLoadingFetch, setIsLoadingFetch] = useState(false)
    const pageName = 'home'
    const fetchPageBuilder = async () => {
        try {
            if (pageName) {
                setIsLoadingFetch(true)
                const {data}: any = await api.PageBuilderApi.apiServicesAppPageBuilderGetByNameGet(pageName)
                if (data.result) {
                    setInitialData(JSON.parse(data.result.jsonContent))
                }
                setIsLoadingFetch(false)
            }
        } catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        if (router.isReady) {
            fetchPageBuilder()
        }
    }, [router]);
    return (
        <DefaultLayout>
            {/*<I18nProvider locale={"fa"}>*/}
            {/*    <Calendar showMonthAndYearPickers/>*/}
            {/*</I18nProvider>*/}
            <Render config={conf} data={initialData}/>
        </DefaultLayout>
    );
}
