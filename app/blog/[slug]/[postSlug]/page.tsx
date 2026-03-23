import type React from "react"
import type { Metadata } from "next"
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

// JSON-LD Schema for BlogPosting
function PostJsonLd({
  blog,
  post,
  baseUrl,
  readingTime,
}: {
  blog: any
  post: any
  baseUrl: string
  readingTime: number
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    url: `${baseUrl}/blog/${blog.slug}/${post.slug}`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      "@type": "Organization",
      name: blog.name,
      url: `${baseUrl}/blog/${blog.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: blog.name,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/placeholder-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${blog.slug}/${post.slug}`,
    },
    wordCount: post.content?.split(/\s+/).length || 0,
    timeRequired: `PT${readingTime}M`,
    keywords: post.categories?.join(", ") || "",
    articleSection: post.categories?.[0] || "Geral",
    inLanguage: "pt-BR",
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

// Breadcrumb JSON-LD
function BreadcrumbJsonLd({ blog, post, baseUrl }: { blog: any; post: any; baseUrl: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: blog.name,
        item: `${baseUrl}/blog/${blog.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${baseUrl}/blog/${blog.slug}/${post.slug}`,
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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

  const wordCount = post.content?.split(/\s+/).length || 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  // Track analytics for post view
  await trackAnalytics({
    blog_id: blog.id,
    post_id: post.id,
    page_type: "post",
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myownblog.vercel.app"

  return (
    <>
      <PostJsonLd blog={blog} post={post} baseUrl={baseUrl} readingTime={readingTime} />
      <BreadcrumbJsonLd blog={blog} post={post} baseUrl={baseUrl} />
      <div className="min-h-screen bg-background">
        <BlogHeader blog={blog} />

        <main className="container py-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb navigation */}
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href={`/blog/${blog.slug}`} className="hover:text-foreground transition-colors">
                    {blog.name}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-foreground font-medium truncate max-w-[200px]" aria-current="page">
                  {post.title}
                </li>
              </ol>
            </nav>

            <Button variant="ghost" asChild className="mb-6">
              <Link href={`/blog/${blog.slug}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para {blog.name}
              </Link>
            </Button>

            <article itemScope itemType="https://schema.org/BlogPosting">
              <header className="mb-8">
                <h1 itemProp="headline" className="text-4xl font-bold mb-4" style={{ color: blog.accent_color }}>
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p itemProp="description" className="text-xl text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                )}

                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories.map((category: string) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        style={{ backgroundColor: blog.primary_color + "20", color: blog.accent_color }}
                      >
                        <span itemProp="keywords">{category}</span>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <time
                    itemProp="datePublished"
                    dateTime={post.published_at || post.created_at}
                    className="flex items-center"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.created_at).toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span itemProp="timeRequired" content={`PT${readingTime}M`}>
                      {readingTime} min de leitura
                    </span>
                  </div>
                </div>
                <meta itemProp="author" content={blog.name} />
                <meta itemProp="dateModified" content={post.updated_at || post.created_at} />
              </header>
              {post.custom_css && <style dangerouslySetInnerHTML={{ __html: post.custom_css }} />}
              <div
                itemProp="articleBody"
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
    </>
  )
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug)
  const post = await getPublishedPost(params.slug, params.postSlug)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myownblog.vercel.app"

  if (!blog || !post) {
    return {
      title: "Post Not Found",
    }
  }

  const title = `${post.title} | ${blog.name}`
  const description = post.excerpt || `Leia ${post.title} no ${blog.name}`
  const url = `${baseUrl}/blog/${blog.slug}/${post.slug}`
  const publishedTime = post.published_at || post.created_at
  const modifiedTime = post.updated_at || post.created_at

  return {
    title,
    description,
    keywords: post.categories || [blog.name, "blog", "artigo"],
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
      type: "article",
      locale: "pt_BR",
      url,
      title: post.title,
      description,
      siteName: blog.name,
      publishedTime,
      modifiedTime,
      authors: [blog.name],
      section: post.categories?.[0] || "Geral",
      tags: post.categories || [],
      images: [
        {
          url: `${baseUrl}/placeholder-logo.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [`${baseUrl}/placeholder-logo.png`],
    },
    alternates: {
      canonical: url,
    },
  }
}
