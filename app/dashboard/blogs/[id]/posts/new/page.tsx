import { notFound } from "next/navigation"
import { getBlogById } from "@/lib/database"
import PostEditor from "@/components/editor/post-editor"

interface NewPostPageProps {
  params: {
    id: string
  }
}

export default async function NewPostPage({ params }: NewPostPageProps) {
  const blog = await getBlogById(params.id)
  if (!blog) {
    notFound()
  }

  return <PostEditor blog={blog} mode="create" />
}
