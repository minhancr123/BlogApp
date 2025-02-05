    "use client";
    import Image from "next/image";
    import loginImage from "../../assets/login-image.jpg"
    import Link from "next/link";
    import { SignUpForm } from "./SignUpForm";
    import { Signup } from "@/app/lib/validation";
    import { useForm, FormProvider } from "react-hook-form";
    import {zodResolver} from "@hookform/resolvers/zod";
    import { requiredSignUp } from "@/app/lib/validation";
    export default function Login() {
        const methods = useForm<requiredSignUp>({
            resolver: zodResolver(Signup)
        });
        return (
            <div className="min-h-screen flex justify-center items-center ">
                <div className="flex rounded-2xl max-w-3xl min-w-[50rem] gap-2">
                    <div className="bg-card min-w-[10rem] overflow-hidden">
                        <h1 className="text-center font-bold">Login</h1>
                        <div className="flex flex-col items-center">
                            Sign Up Form
                        </div>
                        <FormProvider {...methods}>
                            <SignUpForm/>
                        </FormProvider>
                        <p>If you dont have an account? <Link href="/login"className="hover:underline">Sign Up</Link></p>
                    </div>
                    <Image
                        src= {loginImage}
                        className="w-1/2 object-cover"
                        alt=""
                    >

                    </Image>
                
                </div>
            </div>
        )
    }