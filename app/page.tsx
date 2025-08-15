import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold tracking-tight">Create Your Own Blog Platform</h1>
        <p className="text-xl text-muted-foreground">
          Build and customize your blog with our powerful SaaS platform. Choose your colors, create posts, and track
          your analytics.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild size="lg">
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
