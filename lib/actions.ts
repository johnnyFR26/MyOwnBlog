"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function createBlogAction(formData: FormData) {
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string

  if (!name || !slug) {
    return { error: "Name and slug are required" }
  }

  // Check if slug already exists
  const { data: existingBlog } = await supabase.from("blogs").select("id").eq("slug", slug).single()

  if (existingBlog) {
    return { error: "A blog with this URL slug already exists" }
  }

  const { data: blog, error } = await supabase
    .from("blogs")
    .insert([
      {
        name,
        slug,
        description: description || null,
        primary_color: "#3b82f6",
        secondary_color: "#1f2937",
        accent_color: "#10b981",
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating blog:", error)
    return { error: "Failed to create blog" }
  }

  revalidatePath("/dashboard")
  return { success: true, blog }
}

export async function createPostAction(formData: FormData) {
  const blogId = formData.get("blog_id") as string
  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const published = formData.get("published") === "true"

  if (!blogId || !title || !slug) {
    return { error: "Blog ID, title, and slug are required" }
  }

  // Check if slug already exists for this blog
  const { data: existingPost } = await supabase
    .from("posts")
    .select("id")
    .eq("blog_id", blogId)
    .eq("slug", slug)
    .single()

  if (existingPost) {
    return { error: "A post with this URL slug already exists in this blog" }
  }

  const { data: post, error } = await supabase
    .from("posts")
    .insert([
      {
        blog_id: blogId,
        title,
        slug,
        content: content || null,
        excerpt: excerpt || null,
        published,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating post:", error)
    return { error: "Failed to create post" }
  }

  revalidatePath(`/dashboard/blogs/${blogId}`)
  return { success: true, post }
}

export async function updatePostAction(formData: FormData) {
  const postId = formData.get("post_id") as string
  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const published = formData.get("published") === "true"

  if (!postId || !title || !slug) {
    return { error: "Post ID, title, and slug are required" }
  }

  // Get the current post to check blog_id
  const { data: currentPost } = await supabase.from("posts").select("blog_id").eq("id", postId).single()

  if (!currentPost) {
    return { error: "Post not found" }
  }

  // Check if slug already exists for this blog (excluding current post)
  const { data: existingPost } = await supabase
    .from("posts")
    .select("id")
    .eq("blog_id", currentPost.blog_id)
    .eq("slug", slug)
    .neq("id", postId)
    .single()

  if (existingPost) {
    return { error: "A post with this URL slug already exists in this blog" }
  }

  const { data: post, error } = await supabase
    .from("posts")
    .update({
      title,
      slug,
      content: content || null,
      excerpt: excerpt || null,
      published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId)
    .select()
    .single()

  if (error) {
    console.error("Error updating post:", error)
    return { error: "Failed to update post" }
  }

  revalidatePath(`/dashboard/blogs/${currentPost.blog_id}`)
  return { success: true, post }
}

export async function updateBlogColorsAction(formData: FormData) {
  const blogId = formData.get("blog_id") as string
  const primaryColor = formData.get("primary_color") as string
  const secondaryColor = formData.get("secondary_color") as string
  const accentColor = formData.get("accent_color") as string

  if (!blogId || !primaryColor || !secondaryColor || !accentColor) {
    return { error: "All color fields are required" }
  }

  // Validate hex color format
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  if (!hexColorRegex.test(primaryColor) || !hexColorRegex.test(secondaryColor) || !hexColorRegex.test(accentColor)) {
    return { error: "Invalid color format. Please use hex colors (e.g., #FF0000)" }
  }

  const { data: blog, error } = await supabase
    .from("blogs")
    .update({
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      accent_color: accentColor,
      updated_at: new Date().toISOString(),
    })
    .eq("id", blogId)
    .select()
    .single()

  if (error) {
    console.error("Error updating blog colors:", error)
    return { error: "Failed to update blog colors" }
  }

  revalidatePath(`/dashboard/blogs/${blogId}`)
  revalidatePath(`/blog/${blog.slug}`)
  return { success: true, blog }
}
