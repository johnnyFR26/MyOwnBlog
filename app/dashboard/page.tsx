import { getUserBlogs, getBlogPosts } from "@/lib/database"
import DashboardHeader from "@/components/dashboard/header"
import BlogCard from "@/components/dashboard/blog-card"
import CreateBlogDialog from "@/components/dashboard/create-blog-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen } from "lucide-react"
import { Footer } from "@/components/footer"
import { getUserSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getUserSession()

  if (!user) {
    redirect("/auth/login")
  }

  const blogs = await getUserBlogs(user.id)

  // Get post counts for each blog
  const blogsWithPostCounts = await Promise.all(
    blogs.map(async (blog) => {
      const posts = await getBlogPosts(blog.id)
      return {
        ...blog,
        postCount: posts.length,
      }
    }),
  )

  return (
    <div className="min-h-screen bg-background m-8">
      <DashboardHeader />

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight">Seus Blogs</h1>
              <Badge variant="secondary" className="text-sm">
                {blogs.length} {blogs.length === 1 ? "blog" : "blogs"}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">Gerencie seus blogs e crie novo conteúdo</p>
          </div>
          <CreateBlogDialog />
        </div>

        <Separator className="mb-8" />

        {blogs.length === 0 ? (
          <Card className="text-center py-16 border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">Nenhum blog ainda</CardTitle>
              <CardDescription className="text-lg max-w-md mx-auto">
                Crie seu primeiro blog para começar a publicar conteúdo e compartilhar suas ideias com o mundo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateBlogDialog />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogsWithPostCounts.map((blog) => (
              <BlogCard key={blog.id} blog={blog} postCount={blog.postCount} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
