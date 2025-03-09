import React from "react";
import {ComponentConfig, DropZone} from "@measured/puck";
import {Swiper, SwiperSlide} from 'swiper/react';

interface SliderProps {
    countSlide?: number
}

export const Slider: ComponentConfig<SliderProps> = {
    label: "Slider",
    fields: {
        countSlide: {
            type: "number",
        },
    },
    render: ({countSlide}) => {
        return (
            <Swiper>
                {Array.from(new Array(countSlide)).map((index) => (
                    <SwiperSlide key={index}>
                        <DropZone zone={`slider_${index}`}/>
                    </SwiperSlide>
                ))}
            </Swiper>
        );
    },
};
