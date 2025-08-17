"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Eye, ArrowLeft, Loader2, Keyboard } from "lucide-react"
import Link from "next/link"
import { createPostAction, updatePostAction } from "@/lib/actions"
import type { Post, Blog } from "@/lib/database"
import KeyboardShortcuts from "./keyboard-shortcuts"

interface PostEditorProps {
  blog: Blog
  post?: Post
  mode: "create" | "edit"
}

export default function PostEditor({ blog, post, mode }: PostEditorProps) {
  const router = useRouter()
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [content, setContent] = useState(post?.content || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [published, setPublished] = useState(post?.published || false)
  const [autoSlug, setAutoSlug] = useState(!post?.slug)

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

  const handleSave = async (shouldPublish?: boolean) => {
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

  const handleShortcutInsert = (template: string, cursorOffset = 0) => {
    const textarea = contentTextareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const textBefore = content.substring(0, start)
    const textAfter = content.substring(end)

    const beforeWithoutSlash = textBefore.endsWith("/") ? textBefore.slice(0, -1) : textBefore

    const newContent = beforeWithoutSlash + template + textAfter
    setContent(newContent)

    setTimeout(() => {
      const newCursorPos = beforeWithoutSlash.length + template.length + cursorOffset
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/blogs/${blog.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para {blog.name}
              </Link>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => handleSave(false)} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Salvar rascunho
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
                <TabsTrigger value="edit">Editar</TabsTrigger>
                <TabsTrigger value="preview">Prévia</TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titulo</Label>
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
                  <Label htmlFor="excerpt">Subtitulo (Opcional)</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Uma pequena introdução do tema..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content">Conteudo</Label>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Keyboard className="h-3 w-3" />
                      Digite "/" para atalhos
                    </div>
                  </div>
                  <div className="relative">
                    <Textarea
                      ref={contentTextareaRef}
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Escreva o conteudo do post... Digite '/' para ver os atalhos disponíveis."
                      rows={20}
                      className="font-mono text-sm"
                    />
                    <KeyboardShortcuts textareaRef={contentTextareaRef} onInsert={handleShortcutInsert} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Você pode usar tags HTML como &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, etc.
                    <br />
                    <strong>Dica:</strong> Digite "/" para abrir o menu de atalhos rápidos!
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
                <CardTitle className="text-lg">Configuraçoes do Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="published" className="text-sm font-medium">
                    Publicado
                  </Label>
                  <Switch id="published" checked={published} onCheckedChange={setPublished} />
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Status: {published ? "Published" : "Draft"}</p>
                  {mode === "edit" && post && (
                    <>
                      <p>Criado em: {new Date(post.created_at).toLocaleDateString()}</p>
                      <p>Atualizado em: {new Date(post.updated_at).toLocaleDateString()}</p>
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
                    <strong>Cores:</strong>
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
                <CardTitle className="text-lg">Atalhos de Teclado</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  • Digite <code className="bg-muted px-1 py-0.5 rounded">/</code> para abrir o menu de atalhos
                </p>
                <p>
                  • Use <code className="bg-muted px-1 py-0.5 rounded">Esc</code> para fechar o menu
                </p>
                <p>
                  • Navegue com as setas e pressione <code className="bg-muted px-1 py-0.5 rounded">Enter</code> para
                  selecionar
                </p>
                <p>• Atalhos disponíveis: títulos, formatação, links, listas, código e mais!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dicas</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Use HTML tags para formatar o conteudo</p>
                <p>• Mantenha o subtitulo abaixo de 100 caracteres</p>
                <p>• Use descriptivos slugs para melhor SEO</p>
                <p>• Salve rascunhos para posterior edição</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
