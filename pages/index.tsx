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

export default function IndexPage() {
    const fetchTest = () =>{
        axios.post('http://salary.bstc.ir/payroll/GetPayrollInformation',{
            "payrollId": 1482,
            "tfCode": "50601"
        },{
            headers:{
                authorization: 'bearer eyJhbGciOiJBMTI4S1ciLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwidHlwIjoiSldUIiwiY3R5IjoiSldUIn0.5HyxcJMkybspi9-ztlMgJ6s-IaiVBjmsDhjP9499-p-KCF-Tk_ofAQ.PJLFC-RN2hwudSdgEMycMw.XJSAWNPISnT3oUXrCn_uHMZWMmKJjeFF9Bb8ghS_WmZ4--EQ53dnb_cVg544oMd80v8JeGJAzR49UibDqd4iozbOfwQtTnXhcLnHnau-pizKMGhkPlppng_fhZSWgEJSVbOJMDlxyUfbmBFL1Kq0CbCbEK22dKdIfpfBf2JLaXtzfL2wMJFiD_tP6_a4dGS5FnngumCmaDhADJmnty-gLbDgOrm-N3e3FjmTe6Nx_oL9hEvTOV6yqKRdrFHcuu71ioA5tiXJd_QRFsjhX6jV8v4vpp4ddBY3ilSo8v_psF2GAAG18A0cDsF8R3G5vGt1mO4I5qb1pbg5cF8naiw3tYN0L6rVVBpIO31QcJlvrQdw0zCzvmuXNMZwO7jE9O_zFGO9OnCTkL4SyXfPa6WrnEfkZyrRTwJkaN8lgPdn9rLIU1VLbBQt2n60IMy6llkdBaZL_LlZf9SR15kKk7n6ZRxWsJ434kYUC0Fns4YfoXQb1fpIgb1J7L5MW3KDTqC0AuIzAwzx6rtURZOMVtx3ffAz_g4DrcYklCbkn9RXD6-xAIez20CQ0AC4EX2hEzfFNJhJhj4uj_DS3vJQtyqGnQ.143s4v_SK_jwy43XqbIYfA'
            }
        })
    }
    return (
        <DefaultLayout>
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="inline-block max-w-xl text-center justify-center">
                    <span className={title()}>Make&nbsp;</span>
                    <span className={title({color: "violet"})}>beautiful&nbsp;</span>
                    <br/>
                    <span className={title()}>
            websites regardless of your design experience.
          </span>
                    <div className={subtitle({class: "mt-4"})}>
                        Beautiful, fast and modern React UI library.
                    </div>
                </div>

                <div className="flex gap-3">
                    <Link
                        isExternal
                        className={buttonStyles({
                            color: "primary",
                            radius: "full",
                            variant: "shadow",
                        })}
                        href={siteConfig.links.docs}
                    >
                        Documentation
                    </Link>
                    <Link
                        isExternal
                        className={buttonStyles({variant: "bordered", radius: "full"})}
                        href={siteConfig.links.github}
                    >
                        <GithubIcon size={20}/>
                        GitHub
                    </Link>
                </div>

                <div className="mt-8">
                    <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
              Get started by editing{" "}
                <Code color="primary">pages/index.tsx</Code>
            </span>
                        <Button onClick={fetchTest}>fetch</Button>
                    </Snippet>
                </div>
            </section>
        </DefaultLayout>
    );
}
