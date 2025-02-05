import { SubmitHandler, useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { requiredSignUp } from "@/app/lib/validation";
import PasswordInput from "@/components/passwordinput";
import LoadingButton from "@/components/LoadingButton";
import { useState } from "react";
import { signup } from "./action";
import { useRouter } from "next/navigation";

// interface RequiredSignUp {
//   email: string;
//   username: string;
//   password: string;
// }

export const SignUpForm = () => {
  const { control, handleSubmit, register, formState: { errors } } = useFormContext<requiredSignUp>();
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const route = useRouter();
  const onSubmit = async (data : requiredSignUp) => {
    console.log("Hello");
    setIsPending(true);
    setErrorMessage("");

    try {
      console.log(data);
      const result = await signup(data);
      if (!result?.error) {
          route.push("/login");
      }
      else if (typeof result.error === "string"){
        setErrorMessage(result.error);
        
              }
    } catch (error) {
      setErrorMessage("Unexpected error occurred. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField control={control} name="username" render={({ field }) => (
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input placeholder="Username" {...register("username")} />
          </FormControl>
          <FormMessage>{errors.username?.message}</FormMessage>
        </FormItem>
      )} />

      <FormField control={control} name="password" render={({ field }) => (
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <PasswordInput placeholder="Password" {...register("password")} />
          </FormControl>
          <FormMessage>{errors.password?.message}</FormMessage>
        </FormItem>
      )} />
    <FormField control={control} name="email" render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="Email" {...register("email")} />
          </FormControl>
          <FormMessage>{errors.email?.message}</FormMessage>
        </FormItem>
      )} />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <LoadingButton loading={isPending} type="submit" className="w-full">
        Create Account
      </LoadingButton>
    </form>
  );
};
