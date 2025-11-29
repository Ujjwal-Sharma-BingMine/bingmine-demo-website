"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, X, User as UserIcon } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/lib/api"

interface PendingRequestResponse {
    requester_id: string
    username: string
    name: string
    requested_at: string
}

export function FollowRequests() {
    const [requests, setRequests] = useState<PendingRequestResponse[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await api.get<PendingRequestResponse[]>("/profile/requests/pending")
                console.log("Pending Requests Response:", response.data)
                if (Array.isArray(response.data)) {
                    setRequests(response.data)
                } else {
                    // Handle case where backend returns {} for empty list
                    console.warn("Received non-array response, defaulting to empty list:", response.data)
                    setRequests([])
                }
            } catch (error) {
                console.error("Failed to fetch follow requests:", error)
                // toast.error("Failed to load follow requests") // Optional: suppress initial load error
            } finally {
                setLoading(false)
            }
        }

        fetchRequests()
    }, [])

    const handleRequest = async (requesterId: string, action: "accept" | "reject") => {
        // Optimistic Update: Remove item immediately
        const previousRequests = [...requests]
        setRequests((prev) => prev.filter((req) => req.requester_id !== requesterId))

        try {
            await api.post(`/profile/requests/${requesterId}?action=${action}`)
            toast.success(action === "accept" ? "Request accepted" : "Request removed")
        } catch (error) {
            console.error(`Failed to ${action} request:`, error)
            toast.error(`Failed to ${action} request. Please try again.`)
            // Revert on error
            setRequests(previousRequests)
        }
    }

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Follow Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-9 w-20" />
                                <Skeleton className="h-9 w-20" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    if (requests.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Follow Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-4">
                        No pending requests
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Follow Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                <AnimatePresence initial={false}>
                    {requests.map((req) => (
                        <motion.div
                            key={req.requester_id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src="" /> {/* Add profile pic if available in API */}
                                        <AvatarFallback>
                                            <UserIcon className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm">{req.username}</span>
                                        <span className="text-xs text-muted-foreground">{req.name}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handleRequest(req.requester_id, "accept")}
                                        className="bg-primary hover:bg-primary/90"
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleRequest(req.requester_id, "reject")}
                                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </CardContent>
        </Card>
    )
}
