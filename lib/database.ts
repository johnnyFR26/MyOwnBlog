import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface Blog {
  id: string
  user_id: string
  name: string
  slug: string
  description: string | null
  primary_color: string
  secondary_color: string
  accent_color: string
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  blog_id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  published: boolean
  featured_image_url: string | null
  custom_css: string | null
  categories: string[] // Added categories field
  created_at: string
  updated_at: string
}

export async function getUserBlogs(userId: string): Promise<Blog[]> {
  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching blogs:", error)
    return []
  }

  return blogs || []
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const { data: blog, error } = await supabase.from("blogs").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching blog:", error)
    return null
  }

  return blog
}

export async function getBlogPosts(blogId: string): Promise<Post[]> {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("blog_id", blogId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  return posts || []
}

export async function createBlog(data: {
  name: string
  slug: string
  description?: string
  primary_color?: string
  secondary_color?: string
  accent_color?: string
}): Promise<Blog | null> {
  const { data: blog, error } = await supabase.from("blogs").insert([data]).select().single()

  if (error) {
    console.error("Error creating blog:", error)
    return null
  }

  return blog
}

export async function getPublishedPosts(
  blogSlug: string,
  searchQuery?: string,
  categories?: string[],
): Promise<Post[]> {
  try {
    let query = supabase
      .from("posts")
      .select(`
        *,
        blogs!inner(slug)
      `)
      .eq("blogs.slug", blogSlug)
      .eq("published", true)

    // Apply search filter if provided
    if (searchQuery && searchQuery.trim()) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
    }

    // Try to apply category filter, but handle gracefully if column doesn't exist
    if (categories && categories.length > 0) {
      query = query.overlaps("categories", categories)
    }

    query = query.order("created_at", { ascending: false })

    const { data: posts, error } = await query

    if (error) {
      // If error is about missing categories column, retry without category filter
      if (error.code === "42703" && error.message?.includes("categories")) {
        console.log("[v0] Categories column doesn't exist, fetching posts without category filter")
        const { data: fallbackPosts, error: fallbackError } = await supabase
          .from("posts")
          .select(`
            *,
            blogs!inner(slug)
          `)
          .eq("blogs.slug", blogSlug)
          .eq("published", true)
          .order("created_at", { ascending: false })

        if (fallbackError) {
          console.error("Error fetching published posts:", fallbackError)
          return []
        }

        // Apply search filter manually if needed
        if (searchQuery && searchQuery.trim()) {
          const searchLower = searchQuery.toLowerCase()
          return (
            fallbackPosts?.filter(
              (post) =>
                post.title?.toLowerCase().includes(searchLower) ||
                post.content?.toLowerCase().includes(searchLower) ||
                post.excerpt?.toLowerCase().includes(searchLower),
            ) || []
          )
        }

        return fallbackPosts || []
      }

      console.error("Error fetching published posts:", error)
      return []
    }

    return posts || []
  } catch (error: any) {
    // Catch any runtime errors
    console.log("[v0] Error fetching posts, retrying without categories:", error.message)

    // Fallback: fetch without categories
    const { data: fallbackPosts, error: fallbackError } = await supabase
      .from("posts")
      .select(`
        *,
        blogs!inner(slug)
      `)
      .eq("blogs.slug", blogSlug)
      .eq("published", true)
      .order("created_at", { ascending: false })

    if (fallbackError) {
      console.error("Error fetching published posts:", fallbackError)
      return []
    }

    // Apply search filter manually if needed
    if (searchQuery && searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase()
      return (
        fallbackPosts?.filter(
          (post) =>
            post.title?.toLowerCase().includes(searchLower) ||
            post.content?.toLowerCase().includes(searchLower) ||
            post.excerpt?.toLowerCase().includes(searchLower),
        ) || []
      )
    }

    return fallbackPosts || []
  }
}

export async function getBlogCategories(blogSlug: string): Promise<string[]> {
  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select(`
        categories,
        blogs!inner(slug)
      `)
      .eq("blogs.slug", blogSlug)
      .eq("published", true)

    if (error) {
      // If error is about missing categories column, return empty array
      if (error.code === "42703" && error.message?.includes("categories")) {
        console.log("[v0] Categories column doesn't exist yet, returning empty categories")
        return []
      }
      console.error("Error fetching blog categories:", error)
      return []
    }

    // Extract and flatten all categories
    const allCategories = posts?.flatMap((post) => post.categories || []) || []

    // Return unique categories
    return Array.from(new Set(allCategories)).sort()
  } catch (error: any) {
    // Catch any runtime errors including column not found
    console.log("[v0] Error fetching categories, likely column doesn't exist:", error.message)
    return []
  }
}

export async function getPublishedPost(blogSlug: string, postSlug: string): Promise<Post | null> {
  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      blogs!inner(*)
    `)
    .eq("blogs.slug", blogSlug)
    .eq("slug", postSlug)
    .eq("published", true)
    .single()

  if (error) {
    console.error("Error fetching published post:", error)
    return null
  }

  return post
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const { data: blog, error } = await supabase.from("blogs").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Error fetching blog by slug:", error)
    return null
  }

  return blog
}
