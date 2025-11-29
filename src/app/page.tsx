import { Navbar } from "@/components/layout/Navbar"
import { Hero } from "@/components/layout/Hero"
import { Features } from "@/components/layout/Features"
import { Footer } from "@/components/layout/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  )
}
