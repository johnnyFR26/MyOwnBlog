"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Loader2, Eye } from "lucide-react"
import Link from "next/link"
import ColorPicker from "@/components/customization/color-picker"
import ColorSchemePresets from "@/components/customization/color-scheme-presets"
import BlogPreview from "@/components/customization/blog-preview"
import { updateBlogColorsAction } from "@/lib/actions"
import type { Blog } from "@/lib/database"

interface CustomizePageProps {
  params: {
    id: string
  }
}

export default function CustomizePage({ params }: CustomizePageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [blog, setBlog] = useState<Blog | null>(null)
  const [primaryColor, setPrimaryColor] = useState("#3b82f6")
  const [secondaryColor, setSecondaryColor] = useState("#1f2937")
  const [accentColor, setAccentColor] = useState("#10b981")

  // Fetch blog data
  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`/api/blogs/${params.id}`)
        if (response.ok) {
          const blogData = await response.json()
          setBlog(blogData)
          setPrimaryColor(blogData.primary_color)
          setSecondaryColor(blogData.secondary_color)
          setAccentColor(blogData.accent_color)
        }
      } catch (error) {
        console.error("Error fetching blog:", error)
      }
    }

    fetchBlog()
  }, [params.id])

  async function handleSave() {
    if (!blog) return

    setLoading(true)

    const formData = new FormData()
    formData.append("blog_id", blog.id)
    formData.append("primary_color", primaryColor)
    formData.append("secondary_color", secondaryColor)
    formData.append("accent_color", accentColor)

    try {
      const result = await updateBlogColorsAction(formData)
      if (result.success) {
        router.push(`/dashboard/blogs/${blog.id}`)
      } else {
        alert(result.error || "Failed to save colors")
      }
    } catch (error) {
      console.error("Error saving colors:", error)
      alert("Failed to save colors")
    } finally {
      setLoading(false)
    }
  }

  function handleApplyScheme(scheme: { primary: string; secondary: string; accent: string }) {
    setPrimaryColor(scheme.primary)
    setSecondaryColor(scheme.secondary)
    setAccentColor(scheme.accent)
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading blog...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/blogs/${blog.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {blog.name}
              </Link>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/blog/${blog.slug}`} target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                Preview Blog
              </Link>
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Colors
            </Button>
          </div>
        </div>
      </div>

      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Customize Colors</h1>
          <p className="text-muted-foreground">Personalize your blog's appearance with custom colors</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Color Settings</CardTitle>
                <CardDescription>Choose your blog's primary colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ColorPicker
                  label="Primary Color"
                  value={primaryColor}
                  onChange={setPrimaryColor}
                  description="Used for headers and main backgrounds"
                />

                <ColorPicker
                  label="Secondary Color"
                  value={secondaryColor}
                  onChange={setSecondaryColor}
                  description="Used for text on primary backgrounds and borders"
                />

                <ColorPicker
                  label="Accent Color"
                  value={accentColor}
                  onChange={setAccentColor}
                  description="Used for links, buttons, and highlights"
                />
              </CardContent>
            </Card>

            <ColorSchemePresets onApplyScheme={handleApplyScheme} />
          </div>

          <div>
            <BlogPreview
              blogName={blog.name}
              blogDescription={blog.description || ""}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              accentColor={accentColor}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
