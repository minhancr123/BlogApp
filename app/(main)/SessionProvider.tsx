"use client"
import React, { createContext, useContext } from "react"
import type { User , Session } from "lucia"
interface SessionContext {
    user : User, 
    session : Session
}

export const SessionContext =  createContext<SessionContext | null>(null);
export default function SessionProvider({children , value}: React.PropsWithChildren<{value : SessionContext}>) {
   return( <SessionContext.Provider value={value}>
        {children}
    </SessionContext.Provider>)
    
}

export function useSession(){
    const context = useContext(SessionContext);

    return context;
}