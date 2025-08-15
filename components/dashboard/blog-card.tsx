import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Edit, BarChart3 } from "lucide-react"
import Link from "next/link"
import type { Blog } from "@/lib/database"

interface BlogCardProps {
  blog: Blog
  postCount?: number
}

export default function BlogCard({ blog, postCount = 0 }: BlogCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{blog.name}</CardTitle>
            <CardDescription>{blog.description || "No description"}</CardDescription>
          </div>
          <div className="flex space-x-1">
            <div
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: blog.primary_color }}
              title="Primary Color"
            />
            <div
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: blog.secondary_color }}
              title="Secondary Color"
            />
            <div
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: blog.accent_color }}
              title="Accent Color"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Badge variant="secondary">{postCount} posts</Badge>
            <span>/{blog.slug}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/blog/${blog.slug}`} target="_blank">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/blogs/${blog.id}/analytics`}>
                <BarChart3 className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/blogs/${blog.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
