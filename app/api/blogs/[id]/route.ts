import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: blog, error } = await supabase.from("blogs").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching blog:", error)
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error in blog API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
