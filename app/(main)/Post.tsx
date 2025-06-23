"use client";
import { Label } from "@/components/ui/label";
import { FollowingInfo, Postdata, UserData } from "../lib/post_typeprops";
import Link from "next/link";
import Avartar from "./UserAvartarProps";
import { FormatDateTime } from "@/lib/utils";
import { InfiniteData, QueryClient, QueryFilters, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PostPage } from "../lib/post_typeprops";
import { axios } from "../api/axiosInstance";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollIfnitiveComponent } from "@/lib/ScrollIfinitive";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useEffect, useState } from "react";
import { Dialog ,  DialogContent, DialogTrigger , DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { TimeAgo } from "./TimeAgo";
import LinkiFy from "@/components/ui/LinktiFy";
import { UserTooltip } from "@/components/ui/UserTooltip";
import { useSession } from "./SessionProvider";

interface PostProps {
  post: Array<Postdata>;
}

export const Posts = ({ post }: PostProps) => {
  const session = useSession();
  const user = session?.user;
  const queryClient = useQueryClient();
  const [firstload, setfirstload] = useState(true);
  const [activetab, setactivetab] = useState<"foryou" | "folowing">("foryou");
  const Mutation = useMutation({
    mutationFn : async (id : String) => {
      const result = await axios.delete(`/posts/for-you/${id}`);
      return result.data.post;
    },
    onSuccess : async (deledtedPost) => {
      const queryfilter : QueryFilters = {queryKey : ["todo-post", "post-for-you"]};

      await queryClient.cancelQueries(queryfilter);

      queryClient.setQueriesData<InfiniteData<PostPage>>(queryfilter ,(oldData) => {
          if(!oldData) return;

          return {
             pageParams : oldData.pageParams,
             pages : oldData.pages.map(page =>({
                nextCursor :page.nextCursor,
                posts : page.posts.filter(p => p.id != deledtedPost.id)
             }))
          }
      })
      
    },
    onSettled : ()=> {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["todo-post", "post-for-you"] });
    }
  }) 
  const foryouquery = useInfiniteQuery<PostPage>({
    queryKey: ["todo-post", "post-for-you"], 
    queryFn: async ({ pageParam }) => {
      const res = await axios.get("/posts/for-you", {
        params: { cursor: pageParam },
      });
      return res.data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });

  // const folowingquery  = useInfiniteQuery<FollowingInfo>({
  //   queryKey: ["followingInfo", user?.id],
  //   queryFn: async ({ pageParam = 0 }) => {
  //     const res = await axios.get(`/users/follower/${user?.id}?page=${pageParam}`);
  //     return res.data as FollowingInfo;
  //   },
  //   getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  //   initialPageParam: 0,
  //   enabled: !!user?.id,
  // })

  const folowingquery = useInfiniteQuery({
    queryKey: ["empty"],
    queryFn: async () => ({ posts: [], nextCursor: null }),
    getNextPageParam: () => undefined,
    initialPageParam: undefined,
    enabled: false,
  });
  
  const currentquery = activetab == "foryou" ? foryouquery : foryouquery;
  const {
    data,
    error,
    hasPreviousPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    fetchNextPage,
  } = currentquery;
  
  if (status === "pending") {
    return firstload ? (
      <LoadingSkeleton></LoadingSkeleton>
    ) : (
      <Loader2 className="mx-auto animate-spin"></Loader2>
    );
  }

  if (status === "error") {
    return <div>{error.message}</div>;
  }
  
  const posts = data?.pages?.flatMap((page) => page.posts) || [];
  const deletePost = async (id: string) => {
   
    try {
      Mutation.mutate(id);
        
    } catch (error) {
       
    }
};
  return (
    <>
  {/* Tabs */}
  <div className="flex text-black gap-2 w-full max-w-xl mx-auto mt-4">
    {["foryou", "folowing"].map((tab) => (
      <div
        key={tab}
        className={`flex-1 rounded-lg border transition-all duration-200 text-center cursor-pointer ${
          activetab === tab
            ? "bg-gradient-to-r from-indigo-400 to-purple-500 text-white border-indigo-600 shadow-md"
            : "bg-white text-black border-gray-300 hover:bg-gray-100"
        }`}
      >
        <button
          className="w-full py-3 font-medium"
          onClick={() => setactivetab(tab)}
        >
          {tab === "foryou" ? "✨ For You" : "👥 Following"}
        </button>
      </div>
    ))}
  </div>

  {/* Posts */}
  {activetab === "foryou" &&
    posts.map((p) => (
      <ScrollIfnitiveComponent key={p.id} onBottomView={fetchNextPage}>
        <div className="mt-6 w-full max-w-xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm transition-all hover:shadow-md">
          {/* Post header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3 items-center">
              <UserTooltip user={user as UserData}>
                <Link href={`/user/${p.user.username}`}>
                  <Avartar
                    avatarUrl={user?.avatarURL}
                    alt={p.user.username}
                    className="w-10 h-10 border border-gray-300 rounded-full"
                  />
                </Link>
              </UserTooltip>
              <div>
                <p className="font-semibold text-lg text-gray-900 dark:text-white">
                  {p.user.username}
                </p>
                <p className="text-sm text-gray-500">
                  Posted <TimeAgo timestamp={p.createdAt} />
                </p>
              </div>
            </div>

            {/* Delete button */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-sm text-red-600 hover:underline">
                  Delete
                </button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Xóa bài viết</DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn xóa bài viết này không?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-4 justify-end mt-4">
                  <DialogClose asChild>
                    <button
                      onClick={() => deletePost(p.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Yes
                    </button>
                  </DialogClose>
                  <DialogClose asChild>
                    <button className="px-4 py-2 border rounded hover:bg-gray-100 transition">
                      No
                    </button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Post content */}
          <LinkiFy>
            <div className="ml-12 whitespace-pre-line text-gray-800 dark:text-gray-200">
              {p.content}
            </div>
          </LinkiFy>
        </div>
      </ScrollIfnitiveComponent>
    ))}

  {/* Following tab */}
  {activetab === "folowing" && (
    <div className="text-center mt-10 text-gray-500">Coming soon...</div>
  )}

  {/* Loading spinner */}
  {isFetchingNextPage && (
    <div className="flex justify-center my-4">
      <Loader2 className="animate-spin text-blue-500 size-6" />
    </div>
  )}
</>

  );
};
