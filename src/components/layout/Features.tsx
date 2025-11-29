import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Zap, Shield, MessageCircle, Globe } from "lucide-react"

const features = [
    {
        title: "Real-time Feed",
        description: "Stay updated with the latest trends and posts from your network instantly.",
        icon: Zap,
        className: "md:col-span-2",
    },
    {
        title: "Privacy First",
        description: "Your data is yours. We prioritize your privacy with end-to-end encryption.",
        icon: Shield,
        className: "md:col-span-1",
    },
    {
        title: "Instant Messaging",
        description: "Connect with friends and family through our seamless messaging experience.",
        icon: MessageCircle,
        className: "md:col-span-1",
    },
    {
        title: "Global Community",
        description: "Join a diverse community of creators and thinkers from around the world.",
        icon: Globe,
        className: "md:col-span-2",
    },
]

export function Features() {
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Everything you need to connect
                    </h2>
                    <p className="mt-4 text-muted-foreground md:text-xl">
                        Powerful features designed to enhance your social experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {features.map((feature, index) => (
                        <Card key={index} className={`bg-background/50 backdrop-blur border-white/10 ${feature.className}`}>
                            <CardHeader>
                                <feature.icon className="h-10 w-10 text-primary mb-4" />
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
