"use client"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { Button } from '@/components/ui/button'
import { createPost } from './CreatePost'
import { InfiniteData, QueryClient, QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from "react-toastify"
import { Postdata, PostPage } from '../lib/post_typeprops'
import { pages } from 'next/dist/build/templates/app-page'
import { validateRequest } from '../auth'
import { useSession } from './SessionProvider'
import { useEffect, useState } from 'react'
import { User } from 'lucia'

export default  function  PostEditor () {
    const [User , setUser] = useState<User>();
    const queryClient = useQueryClient();
    const session = useSession();
    const user = session?.user;

    useEffect(() => {
        setUser(user);
    })
    const tiptap = useEditor({
        content: "",
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
            }
        },
        extensions: [
            StarterKit.configure({ bold: false, italic: false }),
            Placeholder.configure({ placeholder: "Type something here" })
        ]
    });

    const GetText = () => {
        return tiptap?.getText({ blockSeparator: "\n" }) ?? "";
    }

    
    const Mutation = useMutation({
        mutationFn: async (data: Postdata) => {
            const response = await createPost({ content: data.content, userId: data.userId });
            return response?.result;
        },
        onMutate: async (data: Postdata) => {
            const queryKey = ["todo-post", "post-for-you"];
            const previousData = queryClient.getQueryData<InfiniteData<PostPage>>(queryKey);
        
            queryClient.setQueryData<InfiniteData<PostPage>>(queryKey, (old) => {
                if (!old) {
                    return {
                        pages: [{ posts: [data], nextCursor: null }],
                        pageParams: [],
                    };
                }
        
                const newpost: Postdata = {
                    ...data,
                    createdAt: new Date(),
                };
        
                const updatedPages = [...old.pages];
                updatedPages[0] = {
                    ...updatedPages[0],
                    posts: [newpost, ...updatedPages[0].posts],
                };
        
                return {
                    ...old,
                    pages: updatedPages,
                };
            });
        
            return { previousData };
        }
        ,
        onSuccess: async() => {
            toast.success("Create post successfully");
           
            queryClient.invalidateQueries({queryKey: ["todo-post", "post-for-you"]});
        },
        onError: (err, newText, context) => {
            const queryFilter: QueryFilters = { queryKey: ["todo-post", "post-for-you"] };
            toast.error(err.message);
            queryClient.setQueriesData(queryFilter, context?.previousData);
        },
        onSettled: async() => {
            // Xóa onSettled hoặc để trống để tránh invalidate queries một lần nữa
            const queryFilter: QueryFilters = { queryKey: ["todo-post", "post-for-you"] };
            await queryClient.cancelQueries(queryFilter);
            queryClient.invalidateQueries({queryKey: ["todo-post", "post-for-you"]});
        }
    }); 

    const onsubmit = () => {
        const text = GetText();
        if (!text.trim()) {
            toast.error("Content cannot be empty");
            return;
        }
        const posts : Postdata = {
            id :"",
            content : text,
            userId  : user!.id,
            user : {
                id : user!.id,
                displayname : user!.displayname, 
                username : user!.username
            },
            createdAt : new Date()
        }
        Mutation.mutate(posts);
        tiptap?.commands.clearContent();
    }

    return (
        <div className="flex flex-col w-full rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          
          {/* Editor Section */}
          <div className="flex-grow h-full max-h-[20rem] overflow-auto p-4 bg-red-50 dark:bg-gray-800 transition-colors duration-300">
            <EditorContent
              editor={tiptap}
              className="w-full h-full focus:outline-none text-sm text-gray-800 dark:text-gray-100"
            />
          </div>
      
          {/* Action Section */}
          <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={onsubmit}>Post</Button>
          </div>
          
        </div>
      );
      
}