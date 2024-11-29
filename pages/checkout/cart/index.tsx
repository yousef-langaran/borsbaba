import DefaultLayout from "@/layouts/default";
import {PageCheckoutCart} from "@/components/pages/checkout/cart";


export default function IndexPage() {
    return (
        <DefaultLayout>
            <PageCheckoutCart/>
        </DefaultLayout>
    );
}