import { createClient } from "@supabase/supabase-js"
import type { MetadataRoute } from "next"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myownblog.vercel.app"

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ]

  // Get all published blogs
  const { data: blogs } = await supabase.from("blogs").select("slug, updated_at, created_at")

  const blogPages: MetadataRoute.Sitemap =
    blogs?.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updated_at || blog.created_at),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })) || []

  // Get all published posts
  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      slug,
      updated_at,
      created_at,
      published_at,
      blogs!inner(slug)
    `
    )
    .eq("published", true)

  const postPages: MetadataRoute.Sitemap =
    posts?.map((post: any) => ({
      url: `${baseUrl}/blog/${post.blogs.slug}/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at || post.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || []

  return [...staticPages, ...blogPages, ...postPages]
}
