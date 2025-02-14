import { validateRequest } from "@/app/auth"
import { Post_type, Postdata } from "@/app/lib/post_typeprops";
import { prisma } from "@/app/lib/prisma";
import { pages } from "next/dist/build/templates/app-page";
import { NextRequest } from "next/server";

export const GET = async (req : NextRequest) => {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const {user} = await validateRequest();
    const pagesize = 1;

    if(!user)
    {
        return Response.json({status : 404 , message : "Unauthorized"});
    }
    
    const posts = await prisma.post.findMany({
        include : Post_type,
        take : pagesize + 1,
        cursor : cursor ? {id : cursor} : undefined
    })

    const nextCursor = posts.length > pagesize  ? posts[posts.length -1].id : null;

        
    return Response.json({posts : posts.slice(0 , pagesize) ,nextCursor });
}