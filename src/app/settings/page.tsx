"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { MainLayout } from "@/components/layout/MainLayout"
import { PrivacySettings } from "@/components/settings/PrivacySettings"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

interface UserProfile {
    account_type: "public" | "private"
}

export default function SettingsPage() {
    const router = useRouter()
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/profile/me")
                setUser(response.data)
            } catch (err) {
                console.error("Failed to fetch profile settings", err)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    if (loading) {
        return (
            <MainLayout>
                <div className="p-6 space-y-6">
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <Separator />
                    <Skeleton className="h-48 w-full" />
                </div>
            </MainLayout>
        )
    }

    if (!user) return null

    return (
        <MainLayout>
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Settings</h1>
                <Separator />

                <div className="space-y-6">
                    <section>
                        <h2 className="text-lg font-semibold mb-4">Privacy & Safety</h2>
                        <PrivacySettings initialAccountType={user.account_type} />
                    </section>
                </div>
            </div>
        </MainLayout>
    )
}
