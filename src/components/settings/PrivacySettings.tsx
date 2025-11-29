"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Lock, Globe } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import api from "@/lib/api"

interface PrivacySettingsProps {
    initialAccountType: "public" | "private"
}

export function PrivacySettings({ initialAccountType }: PrivacySettingsProps) {
    const [isPrivate, setIsPrivate] = useState(initialAccountType === "private")

    const handleToggle = async (checked: boolean) => {
        // 1. Optimistic Update
        const previousState = isPrivate
        setIsPrivate(checked)

        try {
            // 2. API Call
            const type = checked ? "private" : "public"
            await api.post(`/profile/change-account-type/${type}`)

            // 3. Success Feedback
            toast.success(`Account set to ${type}`)
        } catch (error: any) {
            // 4. Revert on Error
            setIsPrivate(previousState)
            console.error("Failed to update privacy settings:", error)
            toast.error("Failed to update privacy settings. Please try again.")
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {isPrivate ? <Lock className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                    Privacy
                </CardTitle>
                <CardDescription>
                    Manage who can see your content and interact with you.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-4">
                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="private-account" className="text-base font-medium">
                            Private Account
                        </Label>
                        <span className="text-sm text-muted-foreground">
                            When your account is private, only people you approve can see your photos and videos. Your existing followers won't be affected.
                        </span>
                    </div>
                    <Switch
                        id="private-account"
                        checked={isPrivate}
                        onCheckedChange={handleToggle}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
