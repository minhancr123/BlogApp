"use client"
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import React, { EventHandler } from "react";
import { useRouter } from "next/navigation";

export default function SearchField() {
    const route = useRouter();

    function Search(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const searchinput = form.q as HTMLInputElement;
        if (!searchinput) return;
        route.push(`/search?query=${encodeURIComponent(searchinput.value)}`);
    }

    return (
        <form onSubmit={Search} className="flex items-center gap-2">
            <div className="relative flex items-center">
                <Input name="q" placeholder="Search Field" className="pe-10" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2" type="submit">
                    <SearchIcon className="size-5" />
                </button>
            </div>
        </form>
    );
}
