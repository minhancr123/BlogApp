"use client";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSub, DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import { useSession } from "./SessionProvider";
import Avartar from "./UserAvartarProps";
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu";
import { LogOutIcon, Monitor, Moon, Sun, UserIcon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { logout } from "../(auth)/action";
import { useState , useEffect } from "react";
import { useRouter } from "next/navigation";
interface UserProps {
    className? : string
}
export default function UserButtonProps({className} : UserProps) {
    const {theme , setTheme}= useTheme();
    const [mounted , setmounted] = useState(false);
    const session = useSession();
    const router = useRouter();
    useEffect(() => {
        setmounted(true);
    } , [])
    if(!mounted){ return null}


    // Provide default values to prevent hydration mismatch
    const displayName = session?.user?.displayname || 'User';
    const username = session?.user?.username || 'Anonymous';
    const imageDisplay = session?.user.avatarURL || null;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={cn("flex-none rounded-full" , className)}>
                <Avartar 
                    avatarUrl={imageDisplay} 
                    alt={displayName} 
                    size={40} 
                />

                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Logged in as {displayName}</DropdownMenuLabel> 

                <DropdownMenuSeparator></DropdownMenuSeparator>

                    <Link href={`/users/${username}`}>
                <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                    </Link>
                    
                <DropdownMenuSeparator></DropdownMenuSeparator>
                <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                        <Monitor className="mr-2 h-4 w-4" />
                        <span>Theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() =>setTheme('light')}>
                                <Sun className="size-5" />
                                <span>Light</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() =>setTheme('dark')}>
                                <Moon className="size-5" />
                                <span>Dark</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem> 
                            <Monitor className="size-5" />
                            <span>System</span>
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator></DropdownMenuSeparator>

                <DropdownMenuItem onClick={logout}>
                    <LogOutIcon className="size-5"></LogOutIcon>
                    Sign out
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );
}