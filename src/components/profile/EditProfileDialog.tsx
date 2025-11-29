"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Camera, Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import api from "@/lib/api"
import { uploadImageToCloudinary } from "@/lib/cloudinary"

// --- Types ---
interface UserProfile {
    username: string
    name: string
    bio: string
    profile_pic_url: string
    banner_pic_url: string
}

interface EditProfileDialogProps {
    user: UserProfile
    onProfileUpdate: () => void
}

// --- Schema ---
const profileSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name too long"),
    username: z.string().min(3, "Username too short").max(30, "Username too long").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
})

export function EditProfileDialog({ user, onProfileUpdate }: EditProfileDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Image Previews
    const [previewAvatar, setPreviewAvatar] = useState<string>(user.profile_pic_url)
    const [previewBanner, setPreviewBanner] = useState<string>(user.banner_pic_url)

    // File Refs
    const avatarInputRef = useRef<HTMLInputElement>(null)
    const bannerInputRef = useRef<HTMLInputElement>(null)

    // Selected Files
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [bannerFile, setBannerFile] = useState<File | null>(null)

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name,
            username: user.username,
            bio: user.bio || "",
        },
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "banner") => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            if (type === "avatar") {
                setAvatarFile(file)
                setPreviewAvatar(url)
            } else {
                setBannerFile(file)
                setPreviewBanner(url)
            }
        }
    }

    const onSubmit = async (data: z.infer<typeof profileSchema>) => {
        setIsSubmitting(true)
        try {
            let newProfilePicUrl = user.profile_pic_url
            let newBannerPicUrl = user.banner_pic_url

            // Upload Avatar if changed
            if (avatarFile) {
                newProfilePicUrl = await uploadImageToCloudinary(avatarFile, "profile")
            }

            // Upload Banner if changed
            if (bannerFile) {
                newBannerPicUrl = await uploadImageToCloudinary(bannerFile, "banner")
            }

            // Update Profile
            const payload = {
                ...data,
                profile_pic_url: newProfilePicUrl,
                banner_pic_url: newBannerPicUrl,
            }

            await api.post("/profile/update", payload)

            toast.success("Profile updated successfully")
            setIsOpen(false)
            onProfileUpdate()

        } catch (error: any) {
            console.error("Profile update failed:", error)
            toast.error(error.response?.data?.message || "Failed to update profile")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full font-bold">
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Image Editors */}
                        <div className="relative mb-16">
                            {/* Banner Editor */}
                            <div className="group relative h-32 w-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden rounded-md">
                                {previewBanner ? (
                                    <img src={previewBanner} alt="Banner" className="w-full h-full object-cover opacity-75 group-hover:opacity-50 transition-opacity" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-75 group-hover:opacity-50 transition-opacity" />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => bannerInputRef.current?.click()}>
                                    <div className="bg-black/50 rounded-full p-2">
                                        <Camera className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={bannerInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, "banner")}
                                />
                            </div>

                            {/* Avatar Editor */}
                            <div className="absolute -bottom-12 left-4 group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                                <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                                    <AvatarImage src={previewAvatar} className="object-cover opacity-100 group-hover:opacity-50 transition-opacity" />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <div className="bg-black/50 rounded-full p-2">
                                        <Camera className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={avatarInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, "avatar")}
                                />
                            </div>
                        </div>

                        {/* Text Fields */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us about yourself"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting} className="rounded-full font-bold px-8">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
