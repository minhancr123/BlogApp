"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import React from "react";
import { useRouter } from "next/navigation";

export default function SearchField() {
  const router = useRouter();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.q as HTMLInputElement;
    if (!input || !input.value.trim()) return;

    const query = encodeURIComponent(input.value.trim());
    router.push(`/search?query=${query}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center w-full max-w-md"
    >
      <div className="relative flex w-full items-center">
        <Input
          name="q"
          placeholder="Search..."
          className="pr-10 placeholder:text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors duration-200"
          aria-label="Search"
        >
          <SearchIcon className="size-5" />
        </button>
      </div>
    </form>
  );
}
