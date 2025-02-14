import { PrismaAdapter } from "@lucia-auth/adapter-prisma"
import { Prisma } from "@prisma/client"

export const SelectUser = {
        username : true,
        id : true,
        displayname : true
}satisfies Prisma.UserSelect

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