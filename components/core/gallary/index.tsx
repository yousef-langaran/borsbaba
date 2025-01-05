import {Swiper, SwiperSlide} from 'swiper/react';
import {GetProductMediaResult} from "@/services/digimal";
import {FreeMode, Thumbs} from "swiper/modules";
import React, {useState} from "react";
import {Image} from "@nextui-org/image";


interface ImageGalleryProps {
    data: GetProductMediaResult
}

export const ImageGallery = (props: ImageGalleryProps) => {
    const modules = [FreeMode, Thumbs]
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    return (
        <div>
            <div className="h-60 md:h-full">
                <Swiper
                    spaceBetween={10}
                    modules={modules}
                    thumbs={{swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null}}
                    className="mySwiper2 h-full md:!h-[80%]">
                    {props.data?.allMedias?.map((item, index) => (
                        <SwiperSlide key={index}>
                            <Image classNames={{wrapper: "h-full mx-auto"}} src={item.url || ''}/>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className={"hidden md:flex"}>
                    <Swiper
                        spaceBetween={5}
                        onSwiper={setThumbsSwiper}
                        slidesPerView={4}
                        watchSlidesProgress={true}
                        freeMode={true}
                        modules={modules}
                        className="mySwiper">
                        {props.data?.allMedias?.map((item, index) => (
                            <SwiperSlide key={index}>
                                <Image src={item.url || ''}/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export interface SliderGalleryProps {
    images: Array<{
        imageLink: string,
        alt: string
    }>
}

export const SliderGallery = ({images}: SliderGalleryProps) => {
    return (
        <>
            <Swiper>
                {Array.isArray(images) && images.map((image,index) => (
                    <SwiperSlide key={index}>
                        <Image alt={image.alt} src={image.imageLink}/>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}