"use client";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { Login } from "./action";
import { login, requiredLogin } from "@/app/lib/validation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import PasswordInput from "@/components/passwordinput";
import Link from "next/link";

export default function LoginForm() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<requiredLogin>({
        resolver: zodResolver(login)
    });

    const onSubmit: SubmitHandler<requiredLogin> = async (data) => {
        setIsPending(true);
        setErrorMessage("");

        try {
            const result = await Login(data);
            if (result.error === false) {
                router.push("/");
            } else {
                setErrorMessage("abc");
            }
        } catch (error) {
            console.error("Submission error:", error);
            setErrorMessage("Login failed. Please try again.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <label htmlFor="username" className="block mb-2">Username</label>
                <Input 
                    id="username"
                    placeholder="Username" 
                    {...register("username")}
                />
                {errors.username && (
                    <p className="text-red-500 mt-1">{errors.username.message}</p>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="password" className="block mb-2">Password</label>
                <PasswordInput 
                    id="password"
                    type="password"
                    placeholder="Password" 
                    {...register("password")}
                />
                {errors.password && (
                    <p className="text-red-500 mt-1">{errors.password.message}</p>
                )}
            </div>

            {errorMessage && (
                <p className="text-red-500 mb-4">{errorMessage}</p>
            )}

            <LoadingButton 
                type="submit" 
                loading={isPending} 
                className="w-full"
            >
                Login
            </LoadingButton>
            <div className="flex gap-2">Don't have an account? <Link href="/signup" className="hover:underline">Register</Link></div>
        </form>
    );
}