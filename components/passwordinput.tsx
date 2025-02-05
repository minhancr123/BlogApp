import { useState } from "react"
import {Input,  InputProps } from "./ui/input"
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import React from "react";
const PasswordInput = React.forwardRef<HTMLInputElement ,InputProps>(({className , type , ...props} , ref )  => {
    const [showpassword ,setpassword] = useState(false);
    return(
        <div className="relative py-2">
            <Input type={showpassword ? "text" :  "password"} className={cn("pe-2", className)} ref={ref} {...props}  >
            </Input>
                <button type="button" onClick={()=>setpassword(!showpassword) } className="absolute right-3 top-4">
                    {showpassword ? (<Eye className="size-5"></Eye>) : (<EyeOff className="size-5"></EyeOff>)}
                </button>
        </div>
    )
})

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;