import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { BookOpen } from "lucide-react"
import type { Blog } from "@/lib/database"

interface BlogHeaderProps {
  blog: Blog
}

export default function BlogHeader({ blog }: BlogHeaderProps) {
  return (
    <header
      className="border-b shadow-sm"
      style={{
        backgroundColor: blog.primary_color,
        borderBottomColor: blog.secondary_color,
      }}
    >
      <div className="container py-12 md:py-16">
        <Link href={`/blog/${blog.slug}`} className="block">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-3 rounded-lg"
              style={{
                backgroundColor: blog.accent_color + "20",
              }}
            >
              <BookOpen className="h-8 w-8" style={{ color: blog.accent_color }} />
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              style={{ color: blog.secondary_color }}
            >
              {blog.name}
            </h1>
          </div>
          {blog.description && (
            <>
              <Separator className="my-4 opacity-30" style={{ backgroundColor: blog.secondary_color }} />
              <p className="text-lg md:text-xl max-w-3xl leading-relaxed" style={{ color: blog.secondary_color }}>
                {blog.description}
              </p>
            </>
          )}
        </Link>
      </div>
    </header>
  )
}
