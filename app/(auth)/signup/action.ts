'use server'
import { lucia } from "@/app/auth"
import {prisma} from "@/app/lib/prisma"
import { Signup, requiredSignUp } from "@/app/lib/validation"
import { error } from "console"
import { generateIdFromEntropySize } from "lucia"
import { Modern_Antiqua } from "next/font/google"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const signup = async(creadentials : requiredSignUp): Promise<{error:string | boolean}>=>{
    try{
        
        const {username , password, email} = Signup.parse(creadentials);
        
        const existingusername = await prisma.user.findFirst({
            where : {
                username: {
                    equals : username ,
                    mode: "insensitive"
                }
            }
        })
    
        if(existingusername){
            return {
                error: "Username is existed", 
    
            }
        }
    
        const existingemail = await prisma.user.findFirst({
            where : {
                email : {
                    equals : email,
                    mode: "insensitive"
                } 
            }
        });
    
        if(existingemail){
            return {
                error : "Email is already taken"
            }
        }
        const userId = generateIdFromEntropySize(10);
        await prisma.user.create({
            data:{
                id: userId,
                username : username,
                displayname : username,
                email,
                passwordHash : password
            }
        })

        const session = await lucia.createSession(userId , {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        (await cookies()).set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );
    
        return {error : false};
    }
    catch (error) {
        console.error("Signup error:", error);
        return {
            error: error instanceof Error ? error.message : "Something went wrong"
        };
    }
    }

export const onsubmit = async () => {

}
    