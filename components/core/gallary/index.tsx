import {Swiper, SwiperSlide} from 'swiper/react';
import {GetProductMediaResult} from "@/services/digimal";
import {FreeMode, Thumbs} from "swiper/modules";
import {useState} from "react";
import {Image} from "@nextui-org/image";
import "@/styles/core/gallary/main.css"

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
interface ImageGalleryProps {
    data: GetProductMediaResult
}

export const ImageGallery = (props:ImageGalleryProps) => {
    const modules = [FreeMode, Thumbs]
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    return (
        <div>
            <div className="h-60 md:h-full">
                <Swiper
                spaceBetween={10}
                modules={modules}
                thumbs={{ swiper: thumbsSwiper }}
                className="mySwiper2 h-full md:!h-[80%]">
                    {props.data?.allMedias?.map((item,index)=>(
                        <SwiperSlide key={index}>
                            <Image src={item.url || ''}/>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <Swiper
                    spaceBetween={5}
                    onSwiper={setThumbsSwiper}
                    slidesPerView={4}
                    watchSlidesProgress={true}
                    freeMode={true}
                    modules={modules}
                    className="mySwiper">
                    {props.data?.allMedias?.map((item,index)=>(
                        <SwiperSlide key={index}>
                            <Image src={item.url || ''}/>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}