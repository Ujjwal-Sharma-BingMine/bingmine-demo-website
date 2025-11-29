"use client"

import { MainLayout } from "@/components/layout/MainLayout"
import { FollowRequests } from "@/components/profile/FollowRequests"
import { Separator } from "@/components/ui/separator"

export default function RequestsPage() {
    return (
        <MainLayout>
            <div className="p-6 space-y-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Follow Requests</h1>
                    <p className="text-muted-foreground">
                        Manage users who want to follow you.
                    </p>
                </div>
                <Separator />

                <div className="max-w-2xl">
                    <FollowRequests />
                </div>
            </div>
        </MainLayout>
    )
}
