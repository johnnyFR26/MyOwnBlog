import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { getBlogById } from "@/lib/database"
import PostEditor from "@/components/editor/post-editor"

interface NewPostPageProps {
  params: {
    id: string
  }
}

export default async function NewPostPage({ params }: NewPostPageProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const blog = await getBlogById(params.id)
  if (!blog) {
    notFound()
  }

  return <PostEditor blog={blog} mode="create" />
}
