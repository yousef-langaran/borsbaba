import React from "react";
import {ComponentConfig} from "@measured/puck";
import {SliderGallery, SliderGalleryProps} from "@/components/core/gallary";


export const SliderImage: ComponentConfig<SliderGalleryProps> = {
    label: "SliderImage",
    fields: {
        images: {
            type: "array",
            getItemSummary: (item, i) => `images #${i}`,
            defaultItemProps: {
                imageLink: "",
                alt: "",
            },
            arrayFields: {
                alt: { type: "text" },
                imageLink: { type: "text" },
            },
        },
    },
    defaultProps: {
        images: []
    },
    render: ({images}) => {
        return (
            <div>
                <SliderGallery images={images}/>
            </div>
        );
    },
};
