import type { Metadata } from "next"
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

// JSON-LD Schema for Blog
function BlogJsonLd({ blog, posts, baseUrl }: { blog: any; posts: any[]; baseUrl: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: blog.name,
    description: blog.description || `Blog ${blog.name}`,
    url: `${baseUrl}/blog/${blog.slug}`,
    publisher: {
      "@type": "Organization",
      name: blog.name,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/placeholder-logo.png`,
      },
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || "",
      url: `${baseUrl}/blog/${blog.slug}/${post.slug}`,
      datePublished: post.published_at || post.created_at,
      dateModified: post.updated_at || post.created_at,
      author: {
        "@type": "Organization",
        name: blog.name,
      },
    })),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myownblog.vercel.app"

  return (
    <>
      <BlogJsonLd blog={blog} posts={posts} baseUrl={baseUrl} />
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
    </>
  )
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myownblog.vercel.app"

  if (!blog) {
    return {
      title: "Blog Not Found",
    }
  }

  const title = blog.name
  const description = blog.description || `Leia os posts mais recentes de ${blog.name}`
  const url = `${baseUrl}/blog/${blog.slug}`

  return {
    title,
    description,
    keywords: [blog.name, "blog", "artigos", "posts"],
    authors: [{ name: blog.name }],
    creator: blog.name,
    publisher: "Toasty Tech",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      title,
      description,
      siteName: blog.name,
      images: [
        {
          url: `${baseUrl}/placeholder-logo.png`,
          width: 1200,
          height: 630,
          alt: blog.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/placeholder-logo.png`],
    },
    alternates: {
      canonical: url,
    },
  }
}
