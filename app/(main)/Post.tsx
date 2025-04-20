"use client";
import { Label } from "@/components/ui/label";
import { Postdata } from "../lib/post_typeprops";
import Link from "next/link";
import Avartar from "./UserAvartarProps";
import { FormatDateTime } from "@/lib/utils";
import { InfiniteData, QueryClient, QueryFilters, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostPage } from "../lib/post_typeprops";
import { axios } from "../api/axiosInstance";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollIfnitiveComponent } from "@/lib/ScrollIfinitive";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useEffect, useState } from "react";
import { Dialog ,  DialogContent, DialogTrigger , DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { toast } from "react-toastify";

interface PostProps {
  post: Array<Postdata>;
}

export const Posts = ({ post }: PostProps) => {
  const queryClient = useQueryClient();
  const [firstload, setfirstload] = useState(true);
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
  const {
    data,
    error,
    hasPreviousPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    fetchNextPage,
  } = useInfiniteQuery<PostPage>({
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
      {posts.map((p) => (
        <ScrollIfnitiveComponent
          key={p.id}
          onBottomView={() => {
            fetchNextPage();
          }}
        >
          {
            <div className="mt-3 flex flex-col gap-3 bg-red-50 p-5 border-2 border-gray-200 rounded-sm">
              <div className="flex items-start justify-between">
                <div className = "flex items-center">
                  <Link href="">
                    <Avartar url="" alt="" />
                  </Link>

                  <div className="flex gap-2 items-center">
                    <Label className="block text-xl font-bold">{p.user.username}:</Label>
                    <p className="block text-sm">
                      Posted {FormatDateTime(p.createdAt)}
                    </p>
                  </div>
                </div>  
                <div>
                <Dialog>
                  <DialogTrigger asChild>
                      <button>Delete</button>
                  </DialogTrigger>

                  <DialogContent>
                      <DialogHeader>
                          <DialogTitle>Xóa bài viết</DialogTitle>
                          <DialogDescription>Bạn có chắc chắn muốn xóa bài viết này không?</DialogDescription>
                      </DialogHeader>

                      <div className="flex gap-4">
                      <DialogClose asChild>
                        <button onClick={() => deletePost(p.id)}>Yes</button>
                      </DialogClose>
                            <DialogClose asChild>
                              <span className="cursor-pointer">No</span> 
                          </DialogClose>
                      </div>
                  </DialogContent>
              </Dialog>

                </div>
              </div>
              <div className="whitespace-pre-line break-words">{p.content}</div>
            </div>
          }
        </ScrollIfnitiveComponent>
      ))}
      {/* <Button onClick={() => hasNextPage && fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
        {isFetchingNextPage ? "Loading..." : hasNextPage ? "Load More" : "No More Posts"}
      </Button> */}
      {isFetchingNextPage && <Loader2 className="animate-spin"></Loader2>}
    </>
  );
};
