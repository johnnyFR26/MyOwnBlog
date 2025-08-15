import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye } from "lucide-react"

interface BlogPreviewProps {
  blogName: string
  blogDescription: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

export default function BlogPreview({
  blogName,
  blogDescription,
  primaryColor,
  secondaryColor,
  accentColor,
}: BlogPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          {/* Blog Header Preview */}
          <div className="p-6" style={{ backgroundColor: primaryColor }}>
            <h1 className="text-2xl font-bold mb-2" style={{ color: secondaryColor }}>
              {blogName}
            </h1>
            <p className="opacity-90" style={{ color: secondaryColor }}>
              {blogDescription || "Your blog description will appear here"}
            </p>
          </div>

          {/* Sample Post Preview */}
          <div className="p-6 bg-background">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>
                  Sample Blog Post Title
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  This is how your blog post excerpts will look with your chosen colors...
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Dec 15, 2024
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />5 min read
                  </div>
                  <Badge variant="secondary">Published</Badge>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>
                  Another Sample Post
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Your accent color will be used for post titles and links throughout your blog...
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Dec 10, 2024
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />3 min read
                  </div>
                  <Badge variant="secondary">Published</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Preview */}
          <div
            className="p-4 text-center text-xs text-muted-foreground border-t"
            style={{ borderTopColor: secondaryColor }}
          >
            © 2024 {blogName}. Powered by BlogSaaS.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
