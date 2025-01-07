import DefaultLayout from "@/layouts/default";
import {Render} from "@measured/puck";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import api from "@/services/useApi";
import conf from "@/components/builder/config";


export default function IndexPage() {
    const router = useRouter()
    const [initialData, setInitialData] = useState({})
    const [isLoadingPublish, setIsLoadingPublish] = useState(false)
    const pageName = router.query?.id?.toString()
    const fetchPageBuilder = async () => {
        try {
            if (pageName) {
                setIsLoadingPublish(true)
                const {data}: any = await api.PageBuilderApi.apiServicesAppPageBuilderGetByNameGet(pageName)
                if (data.result) {
                    setInitialData(JSON.parse(data.result.jsonContent))
                }
                setIsLoadingPublish(false)
            }
        } catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        if (router.isReady){
            fetchPageBuilder()
        }
    }, [router]);
    return (
        <DefaultLayout>
            <Render config={conf} data={initialData}/>
        </DefaultLayout>
    );
}