import { notFound } from "next/navigation"
import { getBlogById } from "@/lib/database"
import PostEditor from "@/components/editor/post-editor"
import type { Post } from "@/lib/database"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

interface EditPostPageProps {
  params: {
    id: string
    postId: string
  }
}

async function getPostById(postId: string): Promise<Post | null> {
  const { data: post, error } = await supabase.from("posts").select("*").eq("id", postId).single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  return post
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const blog = await getBlogById(params.id)
  if (!blog) {
    notFound()
  }

  const post = await getPostById(params.postId)
  if (!post) {
    notFound()
  }

  return <PostEditor blog={blog} post={post} mode="edit" />
}
