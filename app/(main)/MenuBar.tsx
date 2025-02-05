import { Button } from "@/components/ui/button";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
interface MenuBarProps {
    className? :string
}
export default function MenuBar({className} : MenuBarProps) {
    return(
        <div className={cn(className , "flex flex-col justify-start border dark:border-white border-black rounded-lg")}>
                <Button
                variant="ghost"
                className="flex justify-start border-b border-black dark:border-white"
                >
                    <Home className="size-5"></Home>
                    <span className="hidden sm:inline">Home</span>
                </Button>
                <Button
                variant="ghost"
                  className="flex justify-start border-b border-black dark:border-white"
                >
                    <Bell className="size-5"></Bell>
                    <span className="hidden sm:inline">Notification</span>
                </Button>
                <Button
                variant="ghost"
                 className="flex justify-start border-b border-black dark:border-white"
                >
                    <Mail className="size-5"></Mail>
                    <span className="hidden sm:inline">Email</span>
                </Button>
                <Button
                variant="ghost"
                className="flex justify-start border-b border-black dark:border-white"
                >
                    <Bookmark className="size-5"></Bookmark>
                    <span className="hidden sm:inline">Book</span>
                </Button>
            </div>
    )
}