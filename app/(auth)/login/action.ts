'use server';

import { prisma } from "@/app/lib/prisma";
import { login, requiredLogin } from "@/app/lib/validation";
// import bcrypt from "bcrypt";
import { lucia } from "@/app/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const Login = async (credentials: requiredLogin): Promise<{ error: string | boolean }> => {
    try {
        const { username, password } = login.parse(credentials);

        const user = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: "insensitive"
                }
            }
        });

        if (!user || !user.passwordHash) {
            return { error: "Username not found" };
        }

        // const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        // if (!isPasswordValid) {
        //     return { error: "Invalid password" };
        // }

        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        const cookieStore = await cookies(); 

        cookieStore.set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );
        
        return {error : false};

    } catch (error) {
        console.error("Login error:", error);
        return {
            error: error instanceof Error ? error.message : "Something went wrong"
        };
    }
};
