"use client"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient , QueryClientProvider } from '@tanstack/react-query'
export const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
    const client = new QueryClient();
    return (
        <QueryClientProvider client={client}>
            {children}
            <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
        </QueryClientProvider>
    )
}