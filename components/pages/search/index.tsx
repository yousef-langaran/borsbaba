import {FiltersProduct} from "@/components/pages/search/filters";

export const PageSearch = () =>{
    return(
        <div className="flex gap-4">
            <div className="w-64">
                <FiltersProduct/>
            </div>
            <div className="grow">

            </div>
        </div>
    )
}