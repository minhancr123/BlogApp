// app/layout.tsx
import { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css"
import { ThemeProvider } from "next-themes";
import { ReactQueryProvider } from "./QueryClientProvider";
export const metadata: Metadata = {
    title: {
        template: "%s | AnBlog",
        default: "An"
    },
    description: "Generate by An Huỳnh"
};

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({children} : RootLayoutProps) {
    return (
        
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    disableTransitionOnChange
                    enableSystem

                >
                    <ReactQueryProvider >
                        {children}

                    </ReactQueryProvider>
                    
                </ThemeProvider>
            </body>
        </html>
    );
}