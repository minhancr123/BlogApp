import Link from "next/link";
import UserButtonProps from "./UserButtonProps";
import SearchField from "@/components/SearchField";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-20 bg-card border-b border-border shadow-sm dark:shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 h-14">
        
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-green-700 dark:text-green-400 tracking-tight whitespace-nowrap"
        >
          An Huynh
        </Link>

        {/* Search field - can grow */}
        <div className="flex-1 max-w-md">
          <SearchField />
        </div>

        {/* User button aligned to right */}
        <div className="ms-auto">
          <UserButtonProps />
        </div>
      </div>
    </header>
  );
}
