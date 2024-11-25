import DefaultLayout from "@/layouts/default";
import {PageCategories} from "@/components/pages/categories";


export default function IndexPage() {
  return (
      <DefaultLayout>
        <PageCategories/>
      </DefaultLayout>
  );
}