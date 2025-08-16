import { notFound } from "next/navigation"
import { getBlogById, getBlogPosts } from "@/lib/database"
import { getAnalyticsSummary } from "@/lib/analytics"
import DashboardHeader from "@/components/dashboard/header"
import AnalyticsWidget from "@/components/analytics/analytics-widget"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye, Calendar, BarChart3, Palette } from "lucide-react"
import Link from "next/link"

interface BlogDetailPageProps {
  params: {
    id: string
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const blog = await getBlogById(params.id)
  if (!blog) {
    notFound()
  }

  const posts = await getBlogPosts(blog.id)
  const analyticsSummary = await getAnalyticsSummary(blog.id)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container py-6">
        <div className="flex items-center justify-between ml-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{blog.name}</h1>
            <p className="text-muted-foreground">{blog.description || "No description"}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/blog/${blog.slug}`} target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                Ver Blog
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/blogs/${blog.id}/analytics`}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/blogs/${blog.id}/customize`}>
                <Palette className="h-4 w-4 mr-2" />
                Customize
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/blogs/${blog.id}/posts/new`}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Post
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.filter((post) => post.published).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.filter((post) => !post.published).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cores do Blog</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: blog.primary_color }} />
                <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: blog.secondary_color }} />
                <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: blog.accent_color }} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mt-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recentes Posts</CardTitle>
                <CardDescription>Gerencie seus posts e crie novos.</CardDescription>
              </CardHeader>
              <CardContent>
                {posts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Sem posts ainda</p>
                    <Button asChild>
                      <Link href={`/dashboard/blogs/${blog.id}/posts/new`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Crie seu primeiro post
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h3 className="font-medium">{post.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(post.created_at).toLocaleDateString()}
                            </div>
                            <Badge variant={post.published ? "default" : "secondary"}>
                              {post.published ? "Publicado" : "Rascunho"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {post.published && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/blog/${blog.slug}/${post.slug}`} target="_blank">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/blogs/${blog.id}/posts/${post.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <AnalyticsWidget
              blogId={blog.id}
              blogName={blog.name}
              totalViews={analyticsSummary.totalViews}
              recentViews={analyticsSummary.recentViews}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
