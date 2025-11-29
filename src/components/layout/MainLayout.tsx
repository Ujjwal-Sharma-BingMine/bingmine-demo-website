import { Sidebar } from "./Sidebar"
import { RightSidebar } from "./RightSidebar"
import { TopNav } from "./TopNav"
import { BottomNav } from "./BottomNav"

interface MainLayoutProps {
    children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Top Navigation */}
            <TopNav />

            <div className="flex-1 container max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 h-[calc(100vh-4rem)]">

                    {/* Left Sidebar (Navigation) */}
                    <aside className="hidden md:block md:col-span-3 lg:col-span-2 overflow-y-auto pb-6">
                        <Sidebar />
                    </aside>

                    {/* Main Content */}
                    <main className="col-span-1 md:col-span-9 lg:col-span-7 overflow-y-auto pb-20 md:pb-6 px-4 md:px-0 no-scrollbar">
                        {children}
                    </main>

                    {/* Right Sidebar (Friends) */}
                    <aside className="hidden lg:block lg:col-span-3 overflow-y-auto pb-6">
                        <RightSidebar />
                    </aside>
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <BottomNav />
        </div>
    )
}

