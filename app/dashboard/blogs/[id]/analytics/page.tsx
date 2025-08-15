import { getBlogById, getBlogPosts } from "@/lib/database"
import { getAnalyticsSummary, getBlogAnalytics } from "@/lib/analytics"
import DashboardHeader from "@/components/dashboard/header"
import AnalyticsOverview from "@/components/analytics/analytics-overview"
import ViewsChart from "@/components/analytics/views-chart"
import PopularPosts from "@/components/analytics/popular-posts"
import TrafficSources from "@/components/analytics/traffic-sources"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface AnalyticsPageProps {
  params: {
    id: string
  }
}

function processAnalyticsData(analytics: any[]) {
  // Process daily views for chart
  const dailyViews = analytics.reduce((acc: any, item: any) => {
    const date = new Date(item.created_at).toISOString().split("T")[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  // Fill in missing dates with 0 views
  const last30Days = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    last30Days.push({
      date: dateStr,
      views: dailyViews[dateStr] || 0,
    })
  }

  // Process traffic sources
  const sources = analytics.reduce((acc: any, item: any) => {
    let source = "Direct"
    if (item.referrer) {
      try {
        const url = new URL(item.referrer)
        source = url.hostname
      } catch {
        source = "Other"
      }
    }
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {})

  const totalVisits = analytics.length
  const trafficSources = Object.entries(sources).map(([source, visits]: [string, any]) => ({
    source,
    visits,
    percentage: (visits / totalVisits) * 100,
  }))

  return {
    dailyViews: last30Days,
    trafficSources,
  }
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const blog = await getBlogById(params.id)
  if (!blog) {
    notFound()
  }

  const posts = await getBlogPosts(blog.id)
  const analyticsSummary = await getAnalyticsSummary(blog.id)
  const analyticsData = await getBlogAnalytics(blog.id, 30)

  const { dailyViews, trafficSources } = processAnalyticsData(analyticsData)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/blogs/${blog.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {blog.name}
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
              <p className="text-muted-foreground">Track your blog's performance and engagement</p>
            </div>
          </div>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        <div className="space-y-6">
          <AnalyticsOverview
            totalViews={analyticsSummary.totalViews}
            recentViews={analyticsSummary.recentViews}
            totalPosts={posts.length}
            publishedPosts={posts.filter((post) => post.published).length}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <ViewsChart data={dailyViews} />
            <TrafficSources data={trafficSources} />
          </div>

          <PopularPosts posts={analyticsSummary.popularPosts} blogSlug={blog.slug} />
        </div>
      </main>
    </div>
  )
}
