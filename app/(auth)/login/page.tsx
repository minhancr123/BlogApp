import { requiredLogin , login } from "@/app/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler } from "react-hook-form"
import Image from "next/image"
import image from "../../assets/login-image.jpg"
import LoginForm from "./LoginForm"
import { Login } from "./action"
export default function LoginPage() {
   
    // const methods = useForm<requiredLogin>({
    //     resolver : zodResolver(login)
    // });
   
    return (
        <main className="flex justify-center items-center h-screen">
            <div className="flex justify-center items-center w-full gap-2 max-w-3xl">
            <div className="bg-card flex items-center flex-col">
                <LoginForm></LoginForm>
            </div>
            <Image alt="" src={image} className="object-cover md:w-1/2 ">

            </Image>

            </div>
        </main>
    )

}