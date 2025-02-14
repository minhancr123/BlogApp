import Link from "next/link"
import UserButtonProps from "./UserButtonProps"
import SearchField from "@/components/SearchField"
export default function NavBar(){
    return (
    <header className="sticky z-10 bg-card shadow-sm py-2">
            <div className="flex items-center justify-center gap-2">
                <Link href ="/" className ="text-3xl font-bold text-green-700">An Huynh</Link>
                <SearchField></SearchField>

                <UserButtonProps className="ms-auto"></UserButtonProps>
            </div>
    </header>
        )
}