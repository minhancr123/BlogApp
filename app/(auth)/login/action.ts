'use server'
import {prisma} from "@/app/lib/prisma";
import { login, requiredLogin } from "@/app/lib/validation"
import { redirect } from "next/navigation";
export const Login = async (credentials: requiredLogin): Promise<{error: string | boolean}> => {
    try {
        const { username, password } = login.parse(credentials);
        
        const usernameexists = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: "insensitive"
                }
            }
        });

        if (!usernameexists) {
            return {
                error: "Username not found"
            }
        }

        // Consider adding password verification
        // const isPasswordValid = await bcrypt.compare(password, usernameexists.passwodHash);
        // if (!isPasswordValid) {
        //     return { error: "Invalid password" };
        // }

       return {error : false};
    } catch (error) {
        console.error("Login error:", error);
        return { error: error instanceof Error ? error.message : "Something went wrong" };
    }
}