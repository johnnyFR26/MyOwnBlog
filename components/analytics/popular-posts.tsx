import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import Link from "next/link"

interface PopularPost {
  post_id: string
  title: string
  slug: string
  views: number
}

interface PopularPostsProps {
  posts: PopularPost[]
  blogSlug: string
}

export default function PopularPosts({ posts, blogSlug }: PopularPostsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Posts</CardTitle>
        <CardDescription>Most viewed posts in the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No post views yet</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div key={post.post_id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <Link
                      href={`/blog/${blogSlug}/${post.slug}`}
                      target="_blank"
                      className="font-medium hover:underline"
                    >
                      {post.title}
                    </Link>
                  </div>
                </div>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{post.views}</span>
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
