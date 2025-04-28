// pages/index.tsx
import DefaultLayout from "@/layouts/default";
import { Render } from "@measured/puck";
import conf from "@/components/builder/config";
import api from "@/services/useApi";
import Head from "next/head";

type Props = {
    initialData: any;
};

export default function IndexPage({ initialData }: Props) {
    return (
        <DefaultLayout>
            <Head>
                <title>عنوان صفحه – وب‌سایت من</title>
                <meta name="description" content="توضیحات صفحه برای موتورهای جستجو…" />
                {/* بقیه متا تگ‌ها / Open Graph */}
            </Head>

            {/* چون initialData از سرور رسیده، Render خروجی‌اش در HTML اولیه قرار می‌گیرد */}
            <Render config={conf} data={initialData} />
        </DefaultLayout>
    );
}

export async function getServerSideProps(context: any) {
    try {
        const pageName = "home";
        const { data }: any = await api.PageBuilderApi.apiServicesAppPageBuilderGetByNameGet(pageName);
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
