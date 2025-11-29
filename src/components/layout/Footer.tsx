import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-slate-50 dark:bg-black py-12">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight">BingMine</span>
                </div>

                <div className="flex gap-8 text-sm text-muted-foreground">
                    <Link href="/about" className="hover:text-foreground transition-colors">
                        About
                    </Link>
                    <Link href="/privacy" className="hover:text-foreground transition-colors">
                        Privacy
                    </Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors">
                        Terms
                    </Link>
                </div>

                <div className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} BingMine. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
