    "use server"
    import { redirect } from "next/navigation";
    import {lucia, validateRequest} from "../auth"
    import { cookies } from "next/headers";
    export const logout = async () => {
        const {session} = await validateRequest() ;

        if(!session?.id){
            throw new Error('Unauthorized');
        }
        await lucia.invalidateSession(session?.id);

        const sessionCookie = await lucia.createBlankSessionCookie();
        
        (await cookies()).set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        )
        return redirect('/login');
    }