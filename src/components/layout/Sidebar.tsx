"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Calendar, Video, Image, FileText, Users, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Updated items based on the image provided
const sidebarItems = [
    { icon: Home, label: "Feed", href: "/feed" },
    { icon: Users, label: "Friends", href: "/friends" }, // Placeholder route
    { icon: Calendar, label: "Event", href: "/events" }, // Placeholder route
    { icon: Video, label: "Watch Videos", href: "/videos" }, // Placeholder route
    { icon: Image, label: "Photos", href: "/photos" }, // Placeholder route
    { icon: FileText, label: "Files", href: "/files" }, // Placeholder route
    { icon: UserPlus, label: "Requests", href: "/requests" },
]

const pagesYouLike = [
    { label: "Fashion Design", icon: "🎨" },
    { label: "Graphic Design", icon: "🖌️", count: 25 },
    { label: "UI/UX Community", icon: "👥" },
    { label: "Web Designer", icon: "💻" },
]

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname()

    return (
        <div className={cn("flex flex-col h-full py-4", className)}>
            {/* Main Navigation */}
            <nav className="space-y-1 px-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Button
                            key={item.href}
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-3 text-base font-medium h-10 px-4 text-muted-foreground hover:text-foreground hover:bg-muted/50",
                                isActive && "text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary"
                            )}
                            asChild
                        >
                            <Link href={item.href}>
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        </Button>
                    )
                })}
            </nav>

            {/* Pages You Like Section */}
            <div className="mt-8 px-6">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Pages You Like
                </h3>
                <div className="space-y-3">
                    {pagesYouLike.map((page, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-lg">
                                    {page.icon}
                                </div>
                                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                    {page.label}
                                </span>
                            </div>
                            {page.count && (
                                <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {page.count}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
