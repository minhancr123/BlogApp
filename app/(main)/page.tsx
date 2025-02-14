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
import { prisma } from "../lib/prisma";
import { Posts } from "./Post";
import { Post_type } from "../lib/post_typeprops";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import TrendSideBar from "@/components/TrendSideBar";
export default async function Home  (){
    const PostValid = await prisma.post.findMany({
        include: Post_type,
    }
)
    const result = await validateRequest();
    console.log(result);
    if(!result.user){
        redirect("/login");
    }
    return (
        <div className="h-[50vh] w-full ">
            <div className="rounded-lg flex items-center gap-2">
                <Avartar size={40} alt="" url={null} className="self-start">
                </Avartar>
                <PostEditor></PostEditor>
            </div>
                   
                <Posts post={PostValid}></Posts>
          
        </div>
    )
       
}

