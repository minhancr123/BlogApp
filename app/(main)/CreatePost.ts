"use server"
import { Postdata, PostPage } from "../lib/post_typeprops";
import { prisma } from "../lib/prisma";
export interface Post{
    content : string,
    userId : string
}

export const createPost = async (data : Post) : Promise<{result :  unknown}> => {
    try {
        const data1 =await prisma.post.create({
            data: {
                content : data.content,
                userId :  data.userId,
            }
        });

        console.log(data1);
        return {result : data1};
        
    } catch (error) {
        return {result : error}
    }
}