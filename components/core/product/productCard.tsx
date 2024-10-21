import {UImage} from "@/components/base/image/image";
import {GetProductFilterByUserResult} from "@/services/digimal";

interface ProductCardProps {
    product: GetProductFilterByUserResult
}
export const ProductCard = (props:ProductCardProps) =>{
    return(
        <div className="p-4 cursor-pointer hover:shadow-xl transition">
            <div>
                <UImage
                    isZoomed
                    alt={props.product?.persianName || ''}
                    src={props.product?.mediaList?.[0]?.allMedias?.[0]?.url || ''}
                    className="aspect-square !w-full !max-w-full bg-blend-multiply"
                    classNames={{wrapper: '!w-full !max-w-full'}}
                />
                <h2 className="text-ellipsis line-clamp-2">{props.product?.persianName}</h2>
            </div>
        </div>
    )
}