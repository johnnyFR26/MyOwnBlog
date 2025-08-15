"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Eye, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { createPostAction, updatePostAction } from "@/lib/actions"
import type { Post, Blog } from "@/lib/database"

interface PostEditorProps {
  blog: Blog
  post?: Post
  mode: "create" | "edit"
}

export default function PostEditor({ blog, post, mode }: PostEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [content, setContent] = useState(post?.content || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [published, setPublished] = useState(post?.published || false)
  const [autoSlug, setAutoSlug] = useState(!post?.slug)

  // Auto-generate slug from title
  useEffect(() => {
    if (autoSlug && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      setSlug(generatedSlug)
    }
  }, [title, autoSlug])

  async function handleSave(shouldPublish?: boolean) {
    if (!title.trim() || !slug.trim()) {
      alert("Title and slug are required")
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("title", title)
    formData.append("slug", slug)
    formData.append("content", content)
    formData.append("excerpt", excerpt)
    formData.append("published", shouldPublish !== undefined ? shouldPublish.toString() : published.toString())

    try {
      let result
      if (mode === "create") {
        formData.append("blog_id", blog.id)
        result = await createPostAction(formData)
      } else {
        formData.append("post_id", post!.id)
        result = await updatePostAction(formData)
      }

      if (result.success) {
        router.push(`/dashboard/blogs/${blog.id}`)
      } else {
        alert(result.error || "Failed to save post")
      }
    } catch (error) {
      console.error("Error saving post:", error)
      alert("Failed to save post")
    } finally {
      setLoading(false)
    }
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
            <Button variant="outline" onClick={() => handleSave(false)} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Draft
            </Button>
            <Button onClick={() => handleSave(true)} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
              {published ? "Update & Publish" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      <main className="container py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="edit" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your post title..."
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value)
                        setAutoSlug(false)
                      }}
                      placeholder="post-url-slug"
                      pattern="[a-z0-9-]+"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAutoSlug(true)}
                      disabled={!title}
                    >
                      Auto
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    URL: {blog.slug}/{slug || "post-slug"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="A brief description of your post..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your post content here... You can use HTML tags for formatting."
                    rows={20}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    You can use HTML tags like &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, etc.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">{title || "Untitled Post"}</CardTitle>
                    {excerpt && <p className="text-muted-foreground">{excerpt}</p>}
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: content || "<p>No content yet...</p>",
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Post Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="published" className="text-sm font-medium">
                    Published
                  </Label>
                  <Switch id="published" checked={published} onCheckedChange={setPublished} />
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Status: {published ? "Published" : "Draft"}</p>
                  {mode === "edit" && post && (
                    <>
                      <p>Created: {new Date(post.created_at).toLocaleDateString()}</p>
                      <p>Updated: {new Date(post.updated_at).toLocaleDateString()}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Blog Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Blog:</strong> {blog.name}
                  </p>
                  <p>
                    <strong>URL:</strong> /{blog.slug}
                  </p>
                  <div className="flex items-center space-x-2">
                    <strong>Colors:</strong>
                    <div className="flex space-x-1">
                      <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: blog.primary_color }} />
                      <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: blog.secondary_color }} />
                      <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: blog.accent_color }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Use HTML tags for rich formatting</p>
                <p>• Keep your excerpt under 160 characters</p>
                <p>• Use descriptive URLs for better SEO</p>
                <p>• Save drafts frequently while writing</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
