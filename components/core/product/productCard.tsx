import {UImage} from "@/components/base/image/image";
import {GetProductFilterByUserResult} from "@/services/digimal";
import {ShowPrice} from "@/components/core/price/showPrice";

interface ProductCardProps {
    product: GetProductFilterByUserResult
}

export const ProductCard = (props: ProductCardProps) => {
    return (
        <a href={`/product/pdi-${props.product.id}/${props.product.persianName}`}>
            <div className="p-4 cursor-pointer hover:shadow-xl transition">
                <div className={"flex gap-4 md:block"}>
                    <UImage
                        isZoomed
                        alt={props.product?.persianName || ''}
                        src={props.product?.mediaList?.[0]?.allMedias?.[0]?.url || ''}
                        className="aspect-square md:!w-full md:!max-w-full bg-blend-multiply w-36 min-w-36"
                        classNames={{wrapper: 'md:!w-full md:!max-w-full'}}
                    />
                    <div className={"grow"}>
                    <h2 className="text-ellipsis line-clamp-2 h-12">{props.product?.persianName}</h2>
                    <ShowPrice data={props.product} price-key="b2CPrice"/>
                    </div>
                </div>
            </div>
        </a>
    )
}