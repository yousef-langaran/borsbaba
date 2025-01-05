import {Link} from "@nextui-org/link";
import {Snippet} from "@nextui-org/snippet";
import {Code} from "@nextui-org/code";
import {button as buttonStyles} from "@nextui-org/theme";

import {siteConfig} from "@/config/site";
import {title, subtitle} from "@/components/primitives";
import {GithubIcon} from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import axios from "axios";
import {Button} from "@nextui-org/button";
import {Render} from "@measured/puck";
import conf, {initialData} from "@/components/builder/config";

export default function IndexPage() {
    const fetchTest = () =>{
        axios.post('http://salary.bstc.ir/payroll/GetPayrollInformation',{
            "payrollId": 1482,
            "tfCode": "50601"
        },{
            headers:{
                authorization: 'bearer eyJhbGciOiJBMTI4S1ciLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwidHlwIjoiSldUIiwiY3R5IjoiSldUIn0.7iaPuRbFZSwEi0hTjFL7IYfWQ97zGO5061PgT-pS-C3eYeqZyysB0g.TElXxKRAojuGgOBotXh1RQ.bHg6UB5Wj3p3OpJTt2bRvSz_fJcOoaX0WStfGOaTcZ6gEkvwCU3QyOPVUcRHLk67V8uryNuufLlWmRkLH-_bIUrBLKNueEs8YrkfllLFWdO9MJyRRYFcyw61RDHlFwAb7Sa24bXBkYsW9VlI2KAyhJmA8iivIcwUcrCSEd6y-AEDf6sEb96-z9x54GtqxMXhWM_W6Jc5O7GwM8NZVGae5yregMkQDEFfDMMoJo3_C9S6aF6_xMPnDFT70UEHX0o4TX3SKwSp0TKK2rLhsquOA3feDRGbG84y697jHunrjbA4Kw4H4lK6nzMJv5NUQXaLrSQ7_gHLkM2iWqKWgFDFXDtyy5ELMOHHucMY2001xjESqozKEvMLKQ6gt0Cixf9ehq579BfNWWMxc8LZZHQnZFodk8WOiGiqXsxyj6qZEbTIiKjvklrhRdNR4PafPFNdWBUnkHhazfBN9jqCjWkPKksv4FZrYuBs2wWwuy_3CazeF6j74mCjKLBobkl1mFn8MWpOYxqbIZsuzFYNuTQ_VHLpfUOJQX6-Y3pVOLZPF_LyexrtqSfX2-5ndlY8k1GKm_HeHDw-tv7iJx_qChf6rg.6I3RAWETFU_jt5KpN4CRqA'
            }
        })
    }
    return (
        <DefaultLayout>
            <Render config={conf} data={initialData}/>
        </DefaultLayout>
    );
}
