import { notFound } from "next/navigation"
import { getBlogBySlug, getPublishedPosts, getBlogCategories } from "@/lib/database"
import BlogHeader from "@/components/blog/blog-header"
import PostCard from "@/components/blog/post-card"
import SearchAndFilter from "@/components/blog/search-and-filter"
import { trackAnalytics } from "@/lib/analytics"
import { BookOpen } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface BlogPageProps {
  params: {
    slug: string
  }
  searchParams: {
    search?: string
    categories?: string
  }
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const blog = await getBlogBySlug(params.slug)
  if (!blog) {
    notFound()
  }

  const searchQuery = searchParams.search || ""
  const selectedCategories = searchParams.categories ? searchParams.categories.split(",").filter(Boolean) : []

  const posts = await getPublishedPosts(params.slug, searchQuery, selectedCategories)
  const availableCategories = await getBlogCategories(params.slug)

  // Track analytics for blog homepage
  await trackAnalytics({
    blog_id: blog.id,
    page_type: "blog_home",
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <BlogHeader blog={blog} />

      <main className="container py-12">
        <div className="mb-12 max-w-4xl mx-auto">
          <SearchAndFilter blogSlug={params.slug} availableCategories={availableCategories} />
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="inline-flex p-6 rounded-full mb-6" style={{ backgroundColor: blog.primary_color + "20" }}>
              <BookOpen className="h-12 w-12" style={{ color: blog.accent_color }} />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-balance">
              {searchQuery || selectedCategories.length > 0 ? "Nenhum post encontrado" : "Ainda não há posts"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto text-pretty">
              {searchQuery || selectedCategories.length > 0
                ? "Tente ajustar seus filtros de pesquisa para encontrar o que procura"
                : "Novos posts serão publicados em breve. Volte mais tarde!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} blog={blog} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t mt-20 bg-muted/30" style={{ borderTopColor: blog.secondary_color + "40" }}>
        <div className="container py-8">
          <Separator className="mb-6" style={{ backgroundColor: blog.secondary_color + "20" }} />
          <div className="text-center space-y-2">
            <p className="text-sm font-medium" style={{ color: blog.accent_color }}>
              {blog.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {"\u00A9"} {new Date().getFullYear()} Todos os direitos reservados &middot; Powered by{" "}
              <span className="font-semibold">Toasty Tech</span>
            </p>
          </div>
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
