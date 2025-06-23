"use client";

import Image from "next/image";
import Link from "next/link";
import loginImage from "../../assets/login-image.jpg";
import { SignUpForm } from "./SignUpForm";
import { Signup } from "@/app/lib/validation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredSignUp } from "@/app/lib/validation";

export default function Login() {
  const methods = useForm<requiredSignUp>({
    resolver: zodResolver(Signup),
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-background text-foreground px-4">
      <div className="flex flex-col md:flex-row rounded-2xl shadow-lg overflow-hidden bg-card border border-border max-w-4xl w-full">
        
        {/* Left Form Side */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-center mb-2">
              👋 Welcome to <span className="text-green-600 dark:text-green-400">AnHuynh's Blog</span>
            </h1>
            <p className="text-center text-muted-foreground">Create your account to get started</p>
          </div>

          <FormProvider {...methods}>
            <SignUpForm />
          </FormProvider>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log In
            </Link>
          </p>
        </div>

        {/* Right Image Side */}
        <div className="hidden md:block w-full md:w-1/2 relative">
          <Image
            src={loginImage}
            alt="Login illustration"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
