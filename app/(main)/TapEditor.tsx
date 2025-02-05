"use client"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { Button } from '@/components/ui/button'
import { createPost } from './CreatePost'


export default function 
PostEditor(){
    const tiptap = useEditor({
        editorProps:{
            attributes: {
                class :'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
            }
        },
        extensions : [StarterKit.configure({
            bold: false,
            italic : false
        }),Placeholder.configure({
            placeholder : "Type something here"
        })],
        
    })

    const getText =  async() => {
        const text = tiptap?.getText({
            blockSeparator: "/n" 
        }) ?? "";

        const result = await createPost({content :text, userId : ""})

        console.log(result);
    }

    const onsubmit = () => {
        getText();
        tiptap?.commands.clearContent();
    }
    return(
<div className="flex flex-col min-h-[10rem] w-full rounded-xl max-h-[20rem] overflow-auto shadow-sm">
    <div className='bg-red-50 h-full flex-grow'>
            <EditorContent editor={tiptap} className=' w-full h-full p-6'>
            </EditorContent>

    </div>
        <div className=" self-end mt-3 flex-grow">
            <Button onClick={onsubmit}>Post</Button>
        </div>
</div>
    )
}