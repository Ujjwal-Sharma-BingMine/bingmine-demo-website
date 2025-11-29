import { MainLayout } from "@/components/layout/MainLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2 } from "lucide-react"

export default function FeedPage() {
    return (
        <MainLayout>
            <div className="p-4 space-y-4">
                {/* Create Post Input (Placeholder) */}
                <div className="border-b pb-4 mb-4">
                    <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="What is happening?!"
                                className="w-full bg-transparent border-none focus:ring-0 text-xl font-medium placeholder:text-muted-foreground"
                            />
                            <div className="flex justify-end mt-4">
                                <Button className="rounded-full font-bold px-6">Post</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feed Posts */}
                {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} className="border-none shadow-none hover:bg-muted/30 transition-colors cursor-pointer">
                        <CardHeader className="flex flex-row items-start gap-4 p-4 pb-2">
                            <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm">User Name</span>
                                    <span className="text-muted-foreground text-sm">@username · {i}h</span>
                                </div>
                                <p className="mt-1 text-sm leading-normal">
                                    This is a sample post content to demonstrate the feed layout. It looks just like a modern social media feed! #BingMine #Launch
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 pl-[4.5rem]">
                            {/* Post Actions */}
                            <div className="flex justify-between max-w-md text-muted-foreground">
                                <Button variant="ghost" size="sm" className="group text-muted-foreground hover:text-blue-500">
                                    <MessageCircle className="h-4 w-4 mr-2 group-hover:bg-blue-500/10 rounded-full" />
                                    <span>12</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="group text-muted-foreground hover:text-pink-500">
                                    <Heart className="h-4 w-4 mr-2 group-hover:bg-pink-500/10 rounded-full" />
                                    <span>48</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="group text-muted-foreground hover:text-green-500">
                                    <Share2 className="h-4 w-4 mr-2 group-hover:bg-green-500/10 rounded-full" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </MainLayout>
    )
}
