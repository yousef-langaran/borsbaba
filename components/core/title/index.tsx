
import React from "react";
interface IProps {
    title: string;
    tag?: keyof JSX.IntrinsicElements;
}

export const CoreTitle: React.FC<IProps> = ({ title, tag: Tag = 'div' }) =>{
    return(
        <div className="baseTitle w-fit">
            <Tag>
                {title}
            </Tag>
        </div>
    )
}