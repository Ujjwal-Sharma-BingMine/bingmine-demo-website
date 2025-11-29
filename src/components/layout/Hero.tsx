"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-48 md:pb-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                    <div className="flex flex-col justify-center space-y-8 text-center lg:text-left">
                        <div className="space-y-4">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
                            >
                                Connect, Share, and <span className="text-primary">Inspire</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:mx-0"
                            >
                                Experience social media reimagined. A platform designed for authentic connections and creative expression.
                            </motion.p>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
                        >
                            <Button size="lg" asChild>
                                <Link href="/signup">Get Started</Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link href="/about">Learn More</Link>
                            </Button>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mx-auto lg:mr-0 relative"
                    >
                        {/* 3D Mockup Placeholder */}
                        <div className="relative w-[280px] h-[580px] bg-gradient-to-br from-gray-900 to-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                            {/* Screen Content Placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 p-4 flex flex-col gap-4">
                                <div className="h-8 w-full bg-white/10 rounded-full animate-pulse" />
                                <div className="flex gap-2 overflow-hidden">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-16 w-16 rounded-full bg-white/10 flex-shrink-0" />
                                    ))}
                                </div>
                                <div className="flex-1 bg-white/5 rounded-xl p-3 space-y-3">
                                    <div className="h-40 w-full bg-white/10 rounded-lg" />
                                    <div className="h-4 w-3/4 bg-white/10 rounded" />
                                    <div className="h-4 w-1/2 bg-white/10 rounded" />
                                </div>
                                <div className="flex-1 bg-white/5 rounded-xl p-3 space-y-3">
                                    <div className="h-40 w-full bg-white/10 rounded-lg" />
                                    <div className="h-4 w-3/4 bg-white/10 rounded" />
                                </div>
                            </div>

                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl" />
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] rounded-full" />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
