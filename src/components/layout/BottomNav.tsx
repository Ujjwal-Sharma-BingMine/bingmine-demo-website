"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, PlusSquare, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { icon: Home, label: "Home", href: "/feed" },
    { icon: Search, label: "Explore", href: "/explore" },
    { icon: PlusSquare, label: "Create", href: "/create", isAction: true },
    { icon: Bell, label: "Alerts", href: "/notifications" },
    { icon: User, label: "Profile", href: "/profile" },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 pb-safe">
            <nav className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary",
                                isActive && "text-primary font-bold",
                                item.isAction && "text-primary"
                            )}
                        >
                            {item.isAction ? (
                                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg -mt-4 border-4 border-background">
                                    <item.icon className="h-6 w-6" />
                                </div>
                            ) : (
                                <item.icon className={cn("h-6 w-6", isActive && "fill-current")} />
                            )}
                            {!item.isAction && <span>{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
