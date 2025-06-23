import Image, { StaticImageData } from "next/image";
import ImagePlace from "../assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";

interface AvatarProps {
  avatarUrl: string | StaticImageData | null | undefined;
  size?: number;
  alt: string;
  className?: string;
}

export default function Avatar(props: AvatarProps) {
  const { avatarUrl, size = 48, alt, className } = props;

  const imageSource: string | StaticImageData =`/upload/${avatarUrl}`;
    console.log(imageSource);
  return (
    <Image
      src={imageSource}
      alt={alt}
      width={size}
      height={size}
      className={cn(
        className,
        "rounded-full flex-none aspect-square bg-secondary h-fit object-cover border-0"
      )}
    />
  );
}