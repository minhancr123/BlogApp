import { number } from "zod"
import Image, { StaticImageData } from "next/image";
import { url } from "inspector";
import ImagePlace from "../assets/avatar-placeholder.png"
interface AvartarProps {
    url : string | undefined | null | StaticImageData;
    size? : number; 
    alt : string;
}

export default function Avartar(Avartar : AvartarProps){
    return (
        <Image  src={Avartar.url || ImagePlace} alt={Avartar.alt} width={Avartar.size || 48} height={Avartar.size || 48}
        className="rounded-full flex-none aspect-square bg-secondary h-fit object-cover border-0"
        >
        </Image>
    )
}