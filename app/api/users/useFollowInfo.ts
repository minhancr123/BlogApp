"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { FollowingInfo } from "@/app/lib/post_typeprops"
import axios from "axios"

export const useFollowInfo = (id: string, initialData: FollowingInfo) => {
    const queryClient = useQueryClient();
    
    return useQuery({
        queryKey: ["followingInfo", id],
        queryFn: async () => {
            const { data } = await axios.get(`/api/users/follower/${id}`);
            return data as FollowingInfo;
        },
        initialData,
    });
}