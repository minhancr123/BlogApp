import { validateRequest } from "@/app/auth";
import React from "react";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import NavBar from "./NavBar";
import MenuBar from "./MenuBar";
import TrendSideBar from "@/components/TrendSideBar";
import { ToastContainer } from "react-toastify";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const result = await validateRequest();
  if (!result.user) {
    redirect("/login");
  }

  return (
    <SessionProvider value={result}>
      <div className="flex flex-col min-h-screen max-w-7xl mx-auto">
        <NavBar />

        <div className="flex w-full grow gap-5 p-5">
          <MenuBar className="sticky top-[5rem] h-fit bg-card dark:bg-card rounded-xl shadow-md p-2" />
          <main className="flex-grow">{children}</main>
          <TrendSideBar />
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </SessionProvider>
  );
}
