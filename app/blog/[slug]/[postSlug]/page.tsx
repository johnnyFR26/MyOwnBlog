import type React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { getBlogBySlug, getPublishedPost } from "@/lib/database"
import BlogHeader from "@/components/blog/blog-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { trackAnalytics } from "@/lib/analytics"

interface PostPageProps {
  params: {
    slug: string
    postSlug: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const blog = await getBlogBySlug(params.slug)
  if (!blog) {
    notFound()
  }

  const post = await getPublishedPost(params.slug, params.postSlug)
  if (!post) {
    notFound()
  }

  const readingTime = Math.ceil((post.content?.length || 0) / 1000)

  // Track analytics for post view
  await trackAnalytics({
    blog_id: blog.id,
    post_id: post.id,
    page_type: "post",
  })

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader blog={blog} />

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link href={`/blog/${blog.slug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para {blog.name}
            </Link>
          </Button>

          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4" style={{ color: blog.accent_color }}>
                {post.title}
              </h1>

              {post.excerpt && <p className="text-xl text-muted-foreground mb-4">{post.excerpt}</p>}

              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      style={{ backgroundColor: blog.primary_color + "20", color: blog.accent_color }}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(post.created_at).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {readingTime} minutos
                </div>
              </div>
            </header>
            {post.custom_css && <style dangerouslySetInnerHTML={{ __html: post.custom_css }} />}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: post.content || "",
              }}
              style={
                {
                  "--tw-prose-links": blog.accent_color,
                  "--tw-prose-headings": blog.secondary_color,
                } as React.CSSProperties
              }
            />
          </article>
        </div>
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

export async function generateMetadata({ params }: PostPageProps) {
  const blog = await getBlogBySlug(params.slug)
  const post = await getPublishedPost(params.slug, params.postSlug)

  if (!blog || !post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | ${blog.name}`,
    description: post.excerpt || `Read ${post.title} on ${blog.name}`,
  }
}
