import { PrismaAdapter } from "@lucia-auth/adapter-prisma"
import { Prisma, User } from "@prisma/client"

export const SelectUser = {
        username : true,
        id : true,
        displayname : true,
}satisfies Prisma.UserSelect

export const DataUserSelect = (LoggedUserId: string): Prisma.UserSelect => ({
    username: true,
    id: true,
    displayname: true,
    avatarUrl : true,
    Followers: {
        select: {
            followerId: true
        },
        where: {
            followerId: LoggedUserId
        }
    },
});
export const  Post_type = {
    user:{
      select : SelectUser
    },
} satisfies Prisma.PostInclude

export type Postdata = Prisma.PostGetPayload<{
    include: typeof Post_type
}>

export interface PostPage {
    posts : Postdata[],
    nextCursor : string | null
}

export interface FollowingInfo {
   followers : number | undefined , 
   isfollowbyUser : boolean
}

export interface UserData {
    id : string,
    displayname : string
    username : string , 
}
