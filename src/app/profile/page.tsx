"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarDays, MapPin, Link as LinkIcon, BarChart, Heart, Settings, LogOut, Edit } from "lucide-react"
import api from "@/lib/api"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { EditProfileDialog } from "@/components/profile/EditProfileDialog"
import Cookies from "js-cookie"

// --- Interfaces ---
interface SocialStats {
    followers_count: number
    following_count: number
    posts_count: number
    video_count: number
    total_views: number
    total_likes: number
}

interface UserProfile {
    username: string
    name: string
    bio: string
    account_type: string
    profile_pic_url: string
    banner_pic_url: string
    social_stats: SocialStats
    created_at: string
}

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchProfile = async () => {
        try {
            const response = await api.get("/profile/me")
            setUser(response.data)
        } catch (err: any) {
            console.error("Failed to fetch profile", err)
            if (err.response?.status === 401) {
                // Redirect handled by interceptor, but good to have fallback
                router.push("/login")
            } else {
                setError("Failed to load profile. Please try again later.")
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [router])

    const handleLogout = () => {
        Cookies.remove("access_token")
        Cookies.remove("refresh_token")
        router.push("/login")
    }

    if (error) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                    <p className="text-destructive font-medium">{error}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </MainLayout>
        )
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="pb-20">
                    {/* Banner Skeleton */}
                    <Skeleton className="h-48 w-full" />
                    <div className="px-4 pb-4">
                        {/* Header Skeleton */}
                        <div className="flex justify-between items-start -mt-16 mb-4">
                            <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
                            <div className="mt-20 flex gap-2">
                                <Skeleton className="h-10 w-24 rounded-full" />
                                <Skeleton className="h-10 w-10 rounded-full" />
                            </div>
                        </div>
                        {/* Details Skeleton */}
                        <div className="space-y-2 mb-6">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-full max-w-md mt-4" />
                        </div>
                    </div>
                </div>
            </MainLayout>
        )
    }

    if (!user) return null

    return (
        <MainLayout>
            <div className="pb-20">
                {/* Header Section */}
                <div className="relative">
                    {/* Banner */}
                    <div className="h-48 w-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                        {user.banner_pic_url ? (
                            <img
                                src={user.banner_pic_url}
                                alt="Banner"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
                        )}
                    </div>

                    <div className="px-4 pb-4">
                        <div className="flex justify-between items-start">
                            {/* Avatar */}
                            <div className="-mt-16 relative">
                                <Avatar className="h-32 w-32 border-4 border-background shadow-sm">
                                    <AvatarImage src={user.profile_pic_url} alt={user.name} />
                                    <AvatarFallback className="text-4xl font-bold bg-zinc-100 dark:bg-zinc-800">
                                        {user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Action Bar */}
                            <div className="mt-4 flex gap-2">
                                <EditProfileDialog user={user} onProfileUpdate={fetchProfile} />
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Settings className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* User Details */}
                        <div className="mt-4 space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold leading-none">{user.name}</h1>
                                {user.account_type === "verified" && (
                                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5">Verified</Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground">@{user.username}</p>
                        </div>

                        {user.bio && (
                            <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">
                                {user.bio}
                            </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                <span>Joined {format(new Date(user.created_at), "MMMM yyyy")}</span>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="mt-4 flex gap-6 text-sm">
                            <div className="flex gap-1 hover:underline cursor-pointer">
                                <span className="font-bold text-foreground">{user.social_stats.following_count}</span>
                                <span className="text-muted-foreground">Following</span>
                            </div>
                            <div className="flex gap-1 hover:underline cursor-pointer">
                                <span className="font-bold text-foreground">{user.social_stats.followers_count}</span>
                                <span className="text-muted-foreground">Followers</span>
                            </div>
                            <div className="flex gap-1 items-center text-pink-600">
                                <Heart className="h-4 w-4" />
                                <span className="font-bold ml-1">{user.social_stats.total_likes}</span>
                                <span className="text-muted-foreground ml-1">Likes</span>
                            </div>
                            <div className="flex gap-1 items-center text-blue-600">
                                <BarChart className="h-4 w-4" />
                                <span className="font-bold ml-1">{user.social_stats.total_views}</span>
                                <span className="text-muted-foreground ml-1">Views</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Content Tabs */}
                <Tabs defaultValue="posts" className="w-full">
                    <TabsList className="w-full justify-start h-12 bg-transparent p-0 border-b rounded-none">
                        <TabsTrigger
                            value="posts"
                            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold"
                        >
                            Posts
                        </TabsTrigger>
                        <TabsTrigger
                            value="media"
                            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold"
                        >
                            Media
                        </TabsTrigger>
                        <TabsTrigger
                            value="liked"
                            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold"
                        >
                            Liked
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="posts" className="p-8 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                            <p className="font-bold text-lg text-foreground">No posts yet</p>
                            <p>When you post, it will show up here.</p>
                            <Button className="mt-4 rounded-full">Create your first post</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="media" className="p-8 text-center text-muted-foreground">
                        <p>No media found</p>
                    </TabsContent>
                    <TabsContent value="liked" className="p-8 text-center text-muted-foreground">
                        <p>No liked posts yet</p>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    )
}
