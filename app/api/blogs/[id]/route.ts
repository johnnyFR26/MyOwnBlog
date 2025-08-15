import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch the blog
    const { data: blog, error } = await supabase.from("blogs").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching blog:", error)
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Check if the blog belongs to the user
    if (blog.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error in blog API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
