import {BuilderEditor} from "@/components/builder";
import api from "@/services/useApi";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

export default function IndexPage() {
    const router = useRouter()
    const [initialData, setInitialData] = useState({})
    const [isLoadingFetch, setIsLoadingFetch] = useState(true)
    const [isLoadingPublish, setIsLoadingPublish] = useState(false)
    const pageName = router.query?.id?.toString()
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
    const onPublish = async (json: any) => {
        try {
            if (pageName) {
                setIsLoadingPublish(true)
                console.log(json)
                const {data} = await api.PageBuilderApi.apiServicesAppPageBuilderAddPost(
                    {
                        name: pageName.toString(),
                        jsonContent: JSON.stringify(json)
                    }
                )
                setIsLoadingPublish(false)
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
        <>
            {!isLoadingFetch &&
                <BuilderEditor initialData={initialData} onPublish={onPublish} isLoadingPublish={isLoadingPublish}/>
            }
        </>
    );
}