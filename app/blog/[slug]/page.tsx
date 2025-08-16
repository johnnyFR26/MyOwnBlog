import { notFound } from "next/navigation"
import { getBlogBySlug, getPublishedPosts } from "@/lib/database"
import BlogHeader from "@/components/blog/blog-header"
import PostCard from "@/components/blog/post-card"
import { trackAnalytics } from "@/lib/analytics"

interface BlogPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const blog = await getBlogBySlug(params.slug)
  if (!blog) {
    notFound()
  }

  const posts = await getPublishedPosts(params.slug)

  // Track analytics for blog homepage
  await trackAnalytics({
    blog_id: blog.id,
    page_type: "blog_home",
  })

  return (
    <div className="min-h-screen ml-4 bg-background">
      <BlogHeader blog={blog} />

      <main className="container py-8">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Sem Posts</h2>
            <p className="text-muted-foreground">Nenhum post encontrado. verifique mais tarde!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} blog={blog} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t mt-12" style={{ borderTopColor: blog.secondary_color }}>
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {blog.name}. Powered by Toasty Tech.
          </p>
        </div>
      </footer>
    </div>
  )
}

export async function generateMetadata({ params }: BlogPageProps) {
  const blog = await getBlogBySlug(params.slug)

  if (!blog) {
    return {
      title: "Blog Not Found",
    }
  }

  return {
    title: blog.name,
    description: blog.description || `Read the latest posts from ${blog.name}`,
  }
}
