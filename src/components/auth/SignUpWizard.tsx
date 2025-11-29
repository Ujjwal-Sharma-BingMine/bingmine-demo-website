"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, Phone, User, Lock } from "lucide-react"

// --- Constants ---
const API_BASE_URL = "https://bingmine-backend.onrender.com"

// --- Zod Schemas ---

const contactSchema = z.object({
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
})

const verificationSchema = z.object({
    emailOtp: z.string().length(6, "Email OTP must be 6 digits"),
    phoneOtp: z.string().length(6, "Phone OTP must be 6 digits"),
})

const usernameSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
})

const securitySchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

// --- Component ---

export function SignUpWizard() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [tempToken, setTempToken] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [contactData, setContactData] = useState<{ email: string; phone: string } | null>(null)

    // Forms
    const contactForm = useForm<z.infer<typeof contactSchema>>({
        resolver: zodResolver(contactSchema),
        defaultValues: { email: "", phone: "" },
    })

    const verificationForm = useForm<z.infer<typeof verificationSchema>>({
        resolver: zodResolver(verificationSchema),
        defaultValues: { emailOtp: "", phoneOtp: "" },
    })

    const usernameForm = useForm<z.infer<typeof usernameSchema>>({
        resolver: zodResolver(usernameSchema),
        defaultValues: { username: "" },
    })

    const securityForm = useForm<z.infer<typeof securitySchema>>({
        resolver: zodResolver(securitySchema),
        defaultValues: { password: "", confirmPassword: "" },
    })

    // API Helper
    const performApiCall = async (endpoint: string, payload: any, useToken = false) => {
        setIsLoading(true)
        try {
            const headers: HeadersInit = { "Content-Type": "application/json" }
            if (useToken && tempToken) {
                headers["Authorization"] = `Bearer ${tempToken}`
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers,
                body: JSON.stringify(payload),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong")
            }

            return data
        } catch (error: any) {
            toast.error(error.message || "An error occurred")
            throw error // Re-throw to stop flow
        } finally {
            setIsLoading(false)
        }
    }

    // Handlers
    const onContactSubmit = async (data: z.infer<typeof contactSchema>) => {
        try {
            // Backend expects 'phone_number'
            const payload = {
                email: data.email,
                phone_number: data.phone,
            }
            const result = await performApiCall("/auth/register/initiate", payload)

            if (result.user_id) {
                setUserId(result.user_id)
                setContactData(data)
                setStep(2)
                toast.success("OTPs sent to email and phone")
            } else {
                throw new Error("No user_id received")
            }
        } catch (error) {
            // Error handled in performApiCall
        }
    }

    const onVerificationSubmit = async (data: z.infer<typeof verificationSchema>) => {
        if (!userId) {
            toast.error("User ID missing. Please restart.")
            return
        }

        try {
            const payload = {
                user_id: userId,
                email_otp: data.emailOtp,
                phone_otp: data.phoneOtp,
            }

            const result = await performApiCall("/auth/register/verify-otp", payload)

            if (result.temp_token) {
                setTempToken(result.temp_token)
                setStep(3)
                toast.success("Verification successful")
            } else {
                throw new Error("No token received")
            }
        } catch (error) {
            // Error handled in performApiCall
        }
    }

    const onUsernameSubmit = async (data: z.infer<typeof usernameSchema>) => {
        try {
            const result = await performApiCall("/auth/register/set-username", data, true)

            if (result.temp_token) {
                setTempToken(result.temp_token) // Rotate token
                setStep(4)
                toast.success("Username set successfully")
            } else {
                throw new Error("No token received")
            }
        } catch (error) {
            // Error handled in performApiCall
        }
    }

    const onSecuritySubmit = async (data: z.infer<typeof securitySchema>) => {
        try {
            await performApiCall("/auth/register/set-password", { password: data.password }, true)
            toast.success("Account Created Successfully!")
            router.push("/login")
        } catch (error) {
            // Error handled in performApiCall
        }
    }

    // Animation variants
    const variants = {
        enter: { x: 20, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -20, opacity: 0 },
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <Card className="w-full border-none shadow-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        {step === 1 && "Create Account"}
                        {step === 2 && "Verification"}
                        {step === 3 && "Choose Username"}
                        {step === 4 && "Secure Account"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {step === 1 && "Enter your details to get started"}
                        {step === 2 && "We sent codes to your email and phone"}
                        {step === 3 && "Pick a unique handle for your profile"}
                        {step === 4 && "Set a strong password to finish"}
                    </CardDescription>

                    {/* Progress Indicator */}
                    <div className="flex justify-center gap-2 mt-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className={`h-2 w-2 rounded-full transition-colors duration-300 ${i === step ? "bg-primary scale-125" : i < step ? "bg-primary/50" : "bg-muted"
                                    }`}
                            />
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <AnimatePresence mode="wait" initial={false}>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.2 }}
                            >
                                <Form {...contactForm}>
                                    <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                                        <FormField
                                            control={contactForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email Address</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            <Input className="pl-9" placeholder="name@example.com" {...field} />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={contactForm.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            <Input className="pl-9" placeholder="+1 (555) 000-0000" {...field} />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Continue"}
                                        </Button>
                                    </form>
                                </Form>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.2 }}
                            >
                                <Form {...verificationForm}>
                                    <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="space-y-6">
                                        <FormField
                                            control={verificationForm.control}
                                            name="emailOtp"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email OTP</FormLabel>
                                                    <FormControl>
                                                        <InputOTP maxLength={6} {...field}>
                                                            <InputOTPGroup className="w-full justify-center">
                                                                <InputOTPSlot index={0} />
                                                                <InputOTPSlot index={1} />
                                                                <InputOTPSlot index={2} />
                                                                <InputOTPSlot index={3} />
                                                                <InputOTPSlot index={4} />
                                                                <InputOTPSlot index={5} />
                                                            </InputOTPGroup>
                                                        </InputOTP>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={verificationForm.control}
                                            name="phoneOtp"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone OTP</FormLabel>
                                                    <FormControl>
                                                        <InputOTP maxLength={6} {...field}>
                                                            <InputOTPGroup className="w-full justify-center">
                                                                <InputOTPSlot index={0} />
                                                                <InputOTPSlot index={1} />
                                                                <InputOTPSlot index={2} />
                                                                <InputOTPSlot index={3} />
                                                                <InputOTPSlot index={4} />
                                                                <InputOTPSlot index={5} />
                                                            </InputOTPGroup>
                                                        </InputOTP>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Continue"}
                                        </Button>
                                    </form>
                                </Form>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.2 }}
                            >
                                <Form {...usernameForm}>
                                    <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)} className="space-y-6">
                                        <FormField
                                            control={usernameForm.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Username</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            <Input className="pl-9" placeholder="username" {...field} />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Set Username"}
                                        </Button>
                                    </form>
                                </Form>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.2 }}
                            >
                                <Form {...securityForm}>
                                    <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                                        <FormField
                                            control={securityForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            <Input type="password" className="pl-9" placeholder="••••••••" {...field} />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={securityForm.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            <Input type="password" className="pl-9" placeholder="••••••••" {...field} />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Registration"}
                                        </Button>
                                    </form>
                                </Form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    )
}
