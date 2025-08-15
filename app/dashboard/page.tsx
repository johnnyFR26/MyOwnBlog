import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUserBlogs, getBlogPosts } from "@/lib/database"
import DashboardHeader from "@/components/dashboard/header"
import BlogCard from "@/components/dashboard/blog-card"
import CreateBlogDialog from "@/components/dashboard/create-blog-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const blogs = await getUserBlogs()

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
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Blogs</h1>
            <p className="text-muted-foreground">Manage your blogs and create new content</p>
          </div>
          <CreateBlogDialog />
        </div>

        {blogs.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>No blogs yet</CardTitle>
              <CardDescription>Create your first blog to start publishing content</CardDescription>
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
    </div>
  )
}
