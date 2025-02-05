"use server"
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
                userId : "54iew6k4c5tswwfy",

            }
        });

        return {result : data1};
        
    } catch (error) {
        return {result : error}
    }
}