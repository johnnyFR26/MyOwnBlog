import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

interface AnalyticsData {
  blog_id: string
  post_id?: string
  page_type: "blog_home" | "post" | "about"
}

export async function trackAnalytics(data: AnalyticsData) {
  try {
    const supabase = createClient()
    const headersList = headers()

    // Get visitor information
    const userAgent = headersList.get("user-agent") || ""
    const forwardedFor = headersList.get("x-forwarded-for")
    const realIp = headersList.get("x-real-ip")
    const visitorIp = forwardedFor?.split(",")[0] || realIp || "unknown"
    const referrer = headersList.get("referer") || ""

    // Insert analytics record
    const { error } = await supabase.from("analytics").insert([
      {
        blog_id: data.blog_id,
        post_id: data.post_id || null,
        page_type: data.page_type,
        visitor_ip: visitorIp,
        user_agent: userAgent,
        referrer: referrer,
      },
    ])

    if (error) {
      console.error("Error tracking analytics:", error)
    }
  } catch (error) {
    console.error("Error in trackAnalytics:", error)
  }
}

export async function getBlogAnalytics(blogId: string, days = 30) {
  const supabase = createClient()

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data: analytics, error } = await supabase
    .from("analytics")
    .select("*")
    .eq("blog_id", blogId)
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching analytics:", error)
    return []
  }

  return analytics || []
}

export async function getPostAnalytics(postId: string, days = 30) {
  const supabase = createClient()

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data: analytics, error } = await supabase
    .from("analytics")
    .select("*")
    .eq("post_id", postId)
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching post analytics:", error)
    return []
  }

  return analytics || []
}

export async function getAnalyticsSummary(blogId: string) {
  const supabase = createClient()

  // Get total views for the blog
  const { data: totalViews, error: totalError } = await supabase
    .from("analytics")
    .select("id", { count: "exact" })
    .eq("blog_id", blogId)

  // Get views for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: recentViews, error: recentError } = await supabase
    .from("analytics")
    .select("id", { count: "exact" })
    .eq("blog_id", blogId)
    .gte("created_at", thirtyDaysAgo.toISOString())

  // Get most popular posts
  const { data: popularPosts, error: postsError } = await supabase
    .from("analytics")
    .select(`
      post_id,
      posts!inner(title, slug)
    `)
    .eq("blog_id", blogId)
    .not("post_id", "is", null)
    .gte("created_at", thirtyDaysAgo.toISOString())

  if (totalError || recentError || postsError) {
    console.error("Error fetching analytics summary:", { totalError, recentError, postsError })
    return {
      totalViews: 0,
      recentViews: 0,
      popularPosts: [],
    }
  }

  // Count popular posts
  const postCounts = popularPosts?.reduce((acc: any, item: any) => {
    const postId = item.post_id
    if (!acc[postId]) {
      acc[postId] = {
        post_id: postId,
        title: item.posts.title,
        slug: item.posts.slug,
        views: 0,
      }
    }
    acc[postId].views++
    return acc
  }, {})

  const sortedPosts = Object.values(postCounts || {})
    .sort((a: any, b: any) => b.views - a.views)
    .slice(0, 5)

  return {
    totalViews: totalViews?.length || 0,
    recentViews: recentViews?.length || 0,
    popularPosts: sortedPosts,
  }
}
