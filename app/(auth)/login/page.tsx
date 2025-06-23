import { requiredLogin, login } from "@/app/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler } from "react-hook-form";
import Image from "next/image";
import loginImage from "../../assets/login-image.jpg";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="flex w-full max-w-4xl rounded-2xl overflow-hidden shadow-lg border border-border bg-card dark:bg-gray-900">
        
        {/* Left: Form */}
        <div className="w-full sm:w-1/2 p-8 flex flex-col justify-center space-y-6">
          <h1 className="text-2xl font-bold text-center text-foreground">Welcome back 👋</h1>
          <p className="text-sm text-muted-foreground text-center">
            Log in to continue
          </p>
          <LoginForm />
        </div>

        {/* Right: Image */}
        <div className="hidden sm:block w-1/2">
          <Image
            src={loginImage}
            alt="Login Illustration"
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>
    </main>
  );
}
