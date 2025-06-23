import { useSession } from "@/app/(main)/SessionProvider";
import { PropsWithChildren } from "react";
import { UserData } from "@/app/lib/post_typeprops";
import { Tooltip, TooltipProvider, TooltipTrigger , TooltipContent} from "@radix-ui/react-tooltip";
import Link from "next/link";
import Avartar from "@/app/(main)/UserAvartarProps";
import { prisma } from "@/app/lib/prisma";
import { FollowingButton } from "../FollowingButton";

interface UserWithToolTip extends PropsWithChildren {
    user: UserData
}


export const UserTooltip = ({ children, user }: UserWithToolTip) => {
    // const followingUsers = prisma.follow.findMany({
    //     where : {
    //             followerId : user.id 
    // },
    // select : {
    //     followingId : true
    // }
    // });
    return (
        <TooltipProvider>
            
            <Tooltip >
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent>
                <div className="flex items-center max-w-80 flex-col gap-3 px-1 py-2 bg-gray-300 rounded-xl">
                    <div className="flex items-center justify-center p-2">
                        <Link href={`/users/${user.displayname}`}>
                            <Avartar alt="" url="" size={35}></Avartar>
                        </Link>
                        {user.displayname}
                    </div> 
                    <div>
                        @{user.username}
                        <FollowingButton id={user.id} initialData={{followers : 0 , isfollowbyUser  : false }}></FollowingButton>
                    </div>
                </div>
            </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}