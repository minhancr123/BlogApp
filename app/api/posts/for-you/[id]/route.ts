import { validateRequest } from "@/app/auth"
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req : NextRequest , {params} : {params : {id : string}})  => {
    const {user} = await validateRequest();

    const postId = params.id;

    try {
        const PostValid = await prisma.post.findMany({
            where: {
                id: postId, 
                userId : user?.id
            }
        })

        if(PostValid){
            const post = await prisma.post.delete({
                where : {
                    id : postId
                }
            })
            return NextResponse.json({post,message : "Post Create Successfull"} , {status : 200})
        }
        else{
            return NextResponse.json({message : "Unauthorized"} , {status : 401})
        }
    } catch (error) {
        return NextResponse.json({message : error } , {status : 404})
    }
}