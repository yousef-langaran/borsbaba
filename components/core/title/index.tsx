
import React from "react";
interface IProps {
    title: string;
    tag?: keyof JSX.IntrinsicElements;
}

export const CoreTitle: React.FC<IProps> = ({ title, tag: Tag = 'div' }) =>{
    return(
        <div className="baseTitle w-fit">
            <Tag className={"font-bold text-lg"}>
                {title}
            </Tag>
            <div className={"h-2 w-4/5 bg-primary rounded"}/>
        </div>
    )
}