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

export async function getPublishedPosts(blogSlug: string): Promise<Post[]> {
  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      *,
      blogs!inner(slug)
    `)
    .eq("blogs.slug", blogSlug)
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching published posts:", error)
    return []
  }

  return posts || []
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
