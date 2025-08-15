import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import type { Post, Blog } from "@/lib/database"

interface PostCardProps {
  post: Post
  blog: Blog
}

export default function PostCard({ post, blog }: PostCardProps) {
  const readingTime = Math.ceil((post.content?.length || 0) / 1000) // Rough estimate

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link
            href={`/blog/${blog.slug}/${post.slug}`}
            className="hover:underline"
            style={{ color: blog.accent_color }}
          >
            {post.title}
          </Link>
        </CardTitle>
        {post.excerpt && <CardDescription className="text-base">{post.excerpt}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(post.created_at).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {readingTime} min read
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
