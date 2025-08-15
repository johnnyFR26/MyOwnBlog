import Link from "next/link"
import type { Blog } from "@/lib/database"

interface BlogHeaderProps {
  blog: Blog
}

export default function BlogHeader({ blog }: BlogHeaderProps) {
  return (
    <header
      className="border-b"
      style={{
        backgroundColor: blog.primary_color,
        borderBottomColor: blog.secondary_color,
      }}
    >
      <div className="container py-8">
        <Link href={`/blog/${blog.slug}`} className="block">
          <h1 className="text-4xl font-bold mb-2" style={{ color: blog.secondary_color }}>
            {blog.name}
          </h1>
          {blog.description && (
            <p className="text-lg opacity-90" style={{ color: blog.secondary_color }}>
              {blog.description}
            </p>
          )}
        </Link>
      </div>
    </header>
  )
}
