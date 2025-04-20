"use client"
import React from "react";
import { Button } from "./ui/button";
import { useFollowInfo } from "@/app/api/users/useFollowInfo";
import { FollowingInfo } from "@/app/lib/post_typeprops";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

interface FollowInfo {
    id: string;
    initialData: FollowingInfo;
}

export const FollowingButton: React.FC<FollowInfo> = ({ id, initialData }) => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useFollowInfo(id, initialData);

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

    if (isLoading) {
        return <Button disabled>Loading...</Button>;
    }

    return (
        <Button 
            className="bg-destructive"
            onClick={handleFollow}
        >
            {!data?.isfollowbyUser ? "Unfollow" : "Follow"}
        </Button>
    );
};
