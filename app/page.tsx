import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Footer } from "@/components/footer"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { PenTool, BarChart3, Palette, Users } from "lucide-react"

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            🚀 Blog SaaS Platform
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Create Your Own Blog Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build and customize your blog with our powerful SaaS platform. Choose your colors, create posts, and track
            your analytics with ease.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mt-8">
            <Button asChild size="lg" className="shadow-lg">
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

        <Separator className="my-16" />

        {/* Features Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <PenTool className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Rich Editor</CardTitle>
              <CardDescription>Create beautiful posts with our intuitive editor</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Palette className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Custom Colors</CardTitle>
              <CardDescription>Personalize your blog with custom color schemes</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Track your blog performance with detailed analytics</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Public Pages</CardTitle>
              <CardDescription>Share your blog with custom public URLs</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
