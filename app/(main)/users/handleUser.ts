'use server'
import { cache } from "react";
import { prisma } from "@/app/lib/prisma";
import { DataUserSelect } from "@/app/lib/post_typeprops";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { mkdir , writeFile } from "fs/promises";
import { User } from "@prisma/client";
export const getuser = cache(async (username: string, loggedUserId: string) => {
    const user = await prisma.user.findFirst({
        where: {
            username: {
                equals: username,
                mode: "insensitive",
            },
        },
        select: DataUserSelect(loggedUserId),
    });
    return user;
});

export const postcount = async (loggedUserId : string) =>{
    const postlength = await prisma.post.count({
        where :{
           user : {
            id : loggedUserId
           }
        }})
    return postlength;
}
export const Flowwingcount = async(loggedUserId : string) => {
    const following = await prisma.follow.count({
        where: {
            followerId: loggedUserId,
        },
    });
    return following;
}

export const UserCreatedAt = async(loggedInUserId: string) : Promise<Date> =>{
    const user = await prisma.user.findFirst({
        where :{
            id : loggedInUserId
        }
    })

    if(!user)
        throw new Error("User not logged In")
    return user?.createdAt;
}

export const uploadAvatar = async (userId : string, file : File) : Promise<User> =>{
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploaddir = path.join(process.cwd() , "public", "upload");

        await mkdir(uploaddir , {recursive : true});


    const filename = `${uuidv4()}-${file.name}`;
    const filepath = path.join(uploaddir, filename);

    await writeFile(filepath, buffer);

    const user =  await prisma.user.update({
        where : {
            id : userId
        },
        data : {
            avatarUrl : `${filename}`
        }
    })
    return user;

}