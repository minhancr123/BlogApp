import {z} from "zod"

const requiredString = z.string().trim().min(1, "required");

export const Signup = z.object({
    email : requiredString.email("Invalid Email Address"),
    username : requiredString.regex(
        /^[a-zA-Z0-9_-]+$/,
        "Only letters, numbers"
    ),
    password : requiredString.min(8 , "Password as least at 8")
})

export type requiredSignUp = z.infer<typeof Signup>;

export const login = z.object({
username : requiredString,
password : requiredString
});

export type requiredLogin = z.infer<typeof login>;