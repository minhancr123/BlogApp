import { validateRequest } from "@/app/auth";
import React from "react";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import NavBar from "./NavBar";
import MenuBar from "./MenuBar";
export default async function  Layout ({children} : {children : React.ReactNode}){
    const result = await validateRequest();
    console.log(result);
    if(!result.user){
        redirect("/login");
    }
    return <SessionProvider value={result}>
        <div className="flex flex-col max-w-7xl mx-auto">
            <NavBar></NavBar>
            <div className="flex mx-auto w-full grow gap-5 p-5">
                <MenuBar className="sticky top-[5rem] h-fit dark:bg-card space-x-1"></MenuBar>
                {children}
            </div>
        </div>
        </SessionProvider>

}

