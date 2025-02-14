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

export default  function PostEditor () {
    const queryClient = useQueryClient();
    
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
            const response = await createPost({ content: data.content, userId : data.userId });
            return response?.result;
        },
        onMutate: async (data: Postdata ) => {
            const queryFilter: QueryFilters<InfiniteData<PostPage , string | null>> = { queryKey: ["todo-post", "post-for-you"] };
            await queryClient.cancelQueries(queryFilter);
            const previousData = queryClient.getQueriesData<InfiniteData<PostPage , string | null>>(queryFilter);

         
            queryClient.setQueriesData<InfiniteData<PostPage , string | null>>(queryFilter, (old) : InfiniteData<PostPage> => {
                const firstpage = old?.pages[0];
                if(!firstpage)
                    return {pages :[{posts : [data] , nextCursor : null}] , pageParams : []}; 
                else {
                    const oldpages = [...old.pages];
                    return {pages : [{
                        ...oldpages, 
                        posts : [...oldpages[0].posts, data],
                        nextCursor : oldpages[0].nextCursor
                       
                    }]}
                    }
                });
            return { previousData };
        },
        onSuccess: () => {
            toast.success("Create post successfully");
        },
        onError: (err, newText, context) => {
            const queryFilter: QueryFilters = { queryKey: ["todo-post", "post-for-you"] };
            toast.error(err.message);
            queryClient.setQueriesData(queryFilter, context?.previousData);
        },
        onSettled: async (data) => {
          
            queryClient.invalidateQueries({queryKey : ["todo-post", "post-for-you"]});
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
            userId  : "",
            user : {
                id : "54iew6k4c5tswwfy",
                displayname : "user", 
                username : "user"
            },
            createdAt : new Date()
        }
        Mutation.mutate(posts);
        tiptap?.commands.clearContent();
    }

    return (
        <div className="flex flex-col min-h-[10rem] w-full rounded-xl max-h-[20rem] overflow-auto shadow-sm">
            <div className='bg-red-50 h-full flex-grow'>
                <EditorContent editor={tiptap} className='w-full h-full p-6' />
            </div>
            <div className="self-end mt-3 flex-grow">
                <Button onClick={onsubmit}>Post</Button>
            </div>
        </div>
    );
}
