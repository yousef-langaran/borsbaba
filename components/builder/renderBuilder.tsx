import conf from "@/components/builder/config";
import {Render} from "@measured/puck";
import {useMemo} from "react";
import {useWindowSize} from "@reactuses/core";

interface RenderBuilderProps {
    initialData: any;
}
export const RenderBuilder = ({initialData}:RenderBuilderProps) => {
    const {width} = useWindowSize()
    const activePageData = useMemo(() => {
        if (!initialData?.pages) return initialData;
        // کلیدها رو عددی و صعودی کن
        const sortedBreakpoints = Object.keys(initialData.pages)
            .map(Number)
            .sort((a, b) => a - b);

        // پیدا کن اولین مقداری که از عرض بزرگتر یا مساویه
        const bp = sortedBreakpoints.find(bp => width <= bp);

        // اگر پیدا نکردیم، بزرگترین رو بده (آخر آرایه)
        const finalKey = bp !== undefined ? bp : sortedBreakpoints[sortedBreakpoints.length - 1];

        return initialData.pages[finalKey];
    }, [width, initialData]);

    return (
        <Render config={conf} data={activePageData} />
    )
}