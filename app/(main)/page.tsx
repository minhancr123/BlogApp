import { validateRequest } from "@/app/auth";
import React from "react";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import NavBar from "./NavBar";
import ImagePlaceHolder from "../assets/avatar-placeholder.png"
import MenuBar from "./MenuBar";
import Avartar from "./UserAvartarProps";
import PostEditor from "./TapEditor";
import { Button } from "@/components/ui/button";
export default async function  Home (){
    const result = await validateRequest();
    console.log(result);
    if(!result.user){
        redirect("/login");
    }
    return (
        <div className="h-[50vh] w-full ">
            <div className="rounded-lg flex items-center">
                <Avartar size={40} alt="" url={null}>
                </Avartar>
                <PostEditor></PostEditor>
                
            </div>
        </div>
    )
       
}

