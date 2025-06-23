import {PrismaAdapter} from "@lucia-auth/adapter-prisma"
import {  Lucia , User , Session} from "lucia"
import {prisma} from "./lib/prisma"
import { emitWarning } from "process"
import { Modern_Antiqua } from "next/font/google"
import { areCookiesMutableInCurrentPhase } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { Result } from "postcss"
import { cookies } from "next/headers"
import { cache } from "react"

const adapter = new PrismaAdapter(prisma.session , prisma.user)

export const lucia = new Lucia(adapter ,{
        sessionCookie:{
            expires : false,
            attributes : {
                secure : process.env.NODE_ENV === "production"
            }
        },
        getUserAttributes(databaseUserAttributes) {
            return {
                id : databaseUserAttributes.id,
                username : databaseUserAttributes.username,
                displayname: databaseUserAttributes.displayname,
                avatarURL : databaseUserAttributes.avatarUrl,
                googleId : databaseUserAttributes.googleId
            }
        },
})

declare module "lucia"{
    interface  Register{
        Lucia : typeof lucia;
        DatabaseUserAttributes : DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes{
    id : string;
    username : string;
    displayname : string;
    avatarUrl : string | null;
    googleId : string;
}

export const validateRequest =
    async() : Promise<{user: User , session : Session} | {user : null , session: null}> => {
        const sessionID = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
        if(!sessionID){
            return {
                user : null,
                session : null,
            }
        }

        const result = await lucia.validateSession(sessionID);

        try{

            if(result.session && result.session.fresh){
                const sessioncookie = lucia.createSessionCookie(result.session.id);
    
                (await cookies()).set(
                    sessioncookie.name,
                    sessioncookie.value,
                    sessioncookie.attributes
                );            
            }
            if(!result.session){
                const sessioncookie = lucia.createBlankSessionCookie();
                (await cookies()).set(
                    sessioncookie.name,
                    sessioncookie.value,
                    sessioncookie.attributes
                );
            }
        }
        catch{}

        return result

    }
 