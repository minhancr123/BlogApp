"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuBarProps {
  className?: string;
}

const menuItems = [
  { href: "/", label: "Home", icon: <Home className="size-5" /> },
  { href: "/notifications", label: "Notification", icon: <Bell className="size-5" /> },
  { href: "/mail", label: "Email", icon: <Mail className="size-5" /> },
  { href: "/bookmarks", label: "Book", icon: <Bookmark className="size-5" /> },
];

export default function MenuBar({ className }: MenuBarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        className,
        "flex flex-col gap-1 p-2 rounded-xl border border-border bg-card shadow-sm"
      )}
    >
      {menuItems.map((item) => (
        <Link key={item.href} href={item.href} className="w-full">
          <Button
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full flex items-center gap-3 justify-start px-3 py-2 text-sm text-foreground",
              pathname === item.href
                ? "font-semibold"
                : "hover:bg-muted/60 transition-colors"
            )}
          >
            {item.icon}
            <span className="hidden sm:inline">{item.label}</span>
          </Button>
        </Link>
      ))}
    </nav>
  );
}
