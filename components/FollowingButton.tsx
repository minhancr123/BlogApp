"use client"
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useFollowInfo } from "@/app/api/users/useFollowInfo";
import { FollowingInfo } from "@/app/lib/post_typeprops";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/app/(main)/SessionProvider";

interface FollowInfo {
    id: string;
    initialData: FollowingInfo;
}

export const FollowingButton: React.FC<FollowInfo> = ({ id, initialData }) => {
    const queryClient = useQueryClient();
    const [isfollow ,  ] = useState("Follow");
    const session = useSession();
    const { data, isLoading } = useFollowInfo(id, initialData);
    const currentuserid = session?.user.id;
    console.log(data);
    const handleFollow = async () => {
        try {
           const result = await axios.post(`/api/users/follower/${id}`);
           console.log(result);
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["followingInfo", id] });
        } catch (error) {
            console.error("Failed to update follow status:", error);
        }
    };

    if(currentuserid == id) {
         return null;
    }
    if (isLoading) {
        return <Button disabled>Loading...</Button>;
    }

    return (
        <Button 
            className="bg-destructive"
            onClick={handleFollow}
        >
            {data?.isfollowbyUser ? "Unfollow" : "Follow"}
        </Button>
    );
};
