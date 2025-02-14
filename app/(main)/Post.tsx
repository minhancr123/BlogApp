"use client";
import { Label } from "@/components/ui/label";
import { Postdata } from "../lib/post_typeprops";
import Link from "next/link";
import Avartar from "./UserAvartarProps";
import { FormatDateTime } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PostPage } from "../lib/post_typeprops";
import { axios } from "../api/axiosInstance";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollIfnitiveComponent } from "@/lib/ScrollIfinitive";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

interface PostProps {
  post: Array<Postdata>;
}

export const Posts = ({ post }: PostProps) => {
  const { data, error, hasPreviousPage , hasNextPage, isFetchingNextPage, status, fetchNextPage } = useInfiniteQuery<PostPage>({
    queryKey: ["todo-post", "post-for-you"],
    queryFn: async ({ pageParam }) => {
      const res = await axios.get("/posts/for-you", {
        params: { cursor: pageParam }
      });
      return res.data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined
  });

  if (status === "pending") {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (status === "error") {
    return <div>{error.message}</div>;
  }
  

  const posts = data?.pages?.flatMap((page) => page.posts) || [];

  return (
    <>
      {posts.map((p) => (
        <ScrollIfnitiveComponent key={p.id} onBottomView={
          () => {
            fetchNextPage();
          }
        }>
          {isFetchingNextPage   ?<LoadingSkeleton></LoadingSkeleton> : ( <div  className="bg-red-50 flex flex-col gap-3 p-5 mt-3">
          <div className="flex">
            <Link href="">
              <Avartar url="" alt="" />
            </Link>
            <div>
              {/* <Label className="block text-xl font-bold">{p.user.username}:</Label> */}
              <p className="block text-sm">{FormatDateTime(p.createdAt)}</p>
            </div>
          </div>
          <div className="whitespace-pre-line break-words">{p.content}</div>
        </div>)}
      
        </ScrollIfnitiveComponent>
      ))}
      {/* <Button onClick={() => hasNextPage && fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
        {isFetchingNextPage ? "Loading..." : hasNextPage ? "Load More" : "No More Posts"}
      </Button> */}
      {isFetchingNextPage && <Loader2 className="animate-spin "></Loader2>}
    </>
  );
};
