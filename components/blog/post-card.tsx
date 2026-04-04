import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Post, Blog } from "@/lib/database"

interface PostCardProps {
  post: Post
  blog: Blog
}

export default function PostCard({ post, blog }: PostCardProps) {
  const readingTime = Math.ceil((post.content?.length || 0) / 1000)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full bg-white border-gray-200">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap gap-2 justify-center">
          {post.categories && post.categories.length > 0 ? (
            post.categories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="font-medium text-sm px-3 py-1"
                style={{ backgroundColor: blog.primary_color + "20", color: blog.accent_color }}
              >
                {category}
              </Badge>
            ))
          ) : (
            <Badge variant="outline" className="font-medium text-sm px-3 py-1">
              Sem categoria
            </Badge>
          )}
        </div>

        <CardTitle className="text-xl md:text-2xl leading-tight text-center group-hover:opacity-80 transition-opacity">
          <Link 
            href={`/blog/${blog.slug}/${post.slug}`} 
            className="hover:underline"
            style={{ color: blog.secondary_color }}
          >
            {post.title}
          </Link>
        </CardTitle>

        {post.excerpt && (
          <CardDescription className="text-base leading-relaxed line-clamp-3 text-center text-gray-600">
            {post.excerpt}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        <Separator className="mb-4 bg-gray-200" />
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{new Date(post.created_at).toLocaleDateString("pt-BR")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          variant="ghost" 
          className="w-full group/btn hover:bg-opacity-10 transition-all" 
          asChild 
          style={{ color: blog.accent_color }}
        >
          <Link href={`/blog/${blog.slug}/${post.slug}`}>
            Ler mais
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
