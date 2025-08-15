import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { getBlogById } from "@/lib/database"
import PostEditor from "@/components/editor/post-editor"
import type { Post } from "@/lib/database"

interface EditPostPageProps {
  params: {
    blogId: string
    postId: string
  }
}

async function getPostById(postId: string): Promise<Post | null> {
  const supabase = createClient()

  const { data: post, error } = await supabase.from("posts").select("*").eq("id", postId).single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  return post
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const blog = await getBlogById(params.blogId)
  if (!blog) {
    notFound()
  }

  const post = await getPostById(params.postId)
  if (!post) {
    notFound()
  }

  return <PostEditor blog={blog} post={post} mode="edit" />
}
