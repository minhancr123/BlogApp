import { boolean } from "zod";
import { Button, ButtonProps } from "./ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
interface LoadingButtonProps extends ButtonProps{
    loading: boolean;
}

export default function LoadingButton({loading , disabled , className , ...props} : LoadingButtonProps){

return <Button disabled = {loading || disabled} className= { cn("flex items-center gap-2" , className) }  {...props}>
    {loading && <Loader2 className="size-5 animate-spin"></Loader2>}
    {props.children}
</Button>
} 