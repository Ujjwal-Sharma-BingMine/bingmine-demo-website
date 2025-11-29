import { LoginForm } from "@/components/auth/LoginForm"
import { Navbar } from "@/components/layout/Navbar"
import { Toaster } from "@/components/ui/sonner"

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-black selection:bg-primary/20 flex flex-col">
            <Navbar />

            <div className="flex-1 grid lg:grid-cols-2">
                {/* Left Side - Form */}
                <div className="flex items-center justify-center p-4 lg:p-12 bg-white dark:bg-black relative order-2 lg:order-1">
                    {/* Mobile Background Elements */}
                    <div className="lg:hidden absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

                    <div className="w-full max-w-md">
                        <LoginForm />
                    </div>
                </div>

                {/* Right Side - Illustration/Image */}
                <div className="hidden lg:flex flex-col justify-center items-center bg-zinc-100 dark:bg-zinc-900 relative overflow-hidden p-12 order-1 lg:order-2">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                    {/* Gradient Orb */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-zinc-400/20 dark:bg-zinc-500/10 opacity-50 blur-[100px] rounded-full" />

                    <div className="relative z-10 max-w-lg text-center space-y-6">
                        {/* 3D Placeholder */}
                        <div className="w-64 h-64 mx-auto bg-gradient-to-tr from-zinc-800 to-zinc-600 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center justify-center transform -rotate-12 hover:-rotate-6 transition-transform duration-500">
                            <div className="w-48 h-48 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center">
                                <div className="w-32 h-32 bg-black/20 rounded-full flex items-center justify-center">
                                    <div className="w-16 h-16 bg-zinc-800 rounded-full shadow-inner" />
                                </div>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-zinc-900 dark:text-white mt-8">
                            Welcome Back.
                        </h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400">
                            Access your dashboard and continue your journey with BingMine.
                        </p>
                    </div>
                </div>
            </div>
            <Toaster />
        </main>
    )
}
