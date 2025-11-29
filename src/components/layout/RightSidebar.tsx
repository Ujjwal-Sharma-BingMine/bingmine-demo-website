"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const friends = [
    { name: "Alex Guerrero", time: "10 min", image: "/avatars/01.png" },
    { name: "Sara Mendoza", online: true, image: "/avatars/02.png" },
    { name: "Ronald Roberts", online: true, image: "/avatars/03.png" },
    { name: "Nancy Lee", time: "12 min", image: "/avatars/04.png" },
    { name: "Marie Jackson", time: "7 min", image: "/avatars/05.png" },
    { name: "Nick Powell", online: true, image: "/avatars/06.png" },
    { name: "Alex Freeman", online: true, image: "/avatars/07.png" },
    { name: "Sandra Rivera", time: "12 min", image: "/avatars/08.png" },
    { name: "Jerry Jordan", online: true, image: "/avatars/09.png" },
]

const groups = [
    { name: "Kelly Powell", time: "1hr", image: "/avatars/10.png" },
]

export function RightSidebar({ className }: { className?: string }) {
    return (
        <div className={cn("flex flex-col h-full py-4 px-4", className)}>
            {/* Search */}
            <div className="relative mb-8">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full bg-transparent border-none pl-9 focus-visible:ring-0 placeholder:text-muted-foreground"
                />
            </div>

            {/* Friends List */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Friends
                    </h3>
                    <div className="space-y-4">
                        {friends.map((friend, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar className="h-9 w-9 border-2 border-background">
                                            <AvatarImage src={friend.image} />
                                            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {friend.online && (
                                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors">
                                        {friend.name}
                                    </span>
                                </div>
                                {friend.time && (
                                    <span className="text-xs text-muted-foreground">{friend.time}</span>
                                )}
                                {friend.online && (
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Groups */}
                <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Groups
                    </h3>
                    <div className="space-y-4">
                        {groups.map((group, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 rounded-lg">
                                        <AvatarImage src={group.image} />
                                        <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors">
                                        {group.name}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">{group.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
