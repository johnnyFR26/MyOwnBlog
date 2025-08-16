import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Eye } from "lucide-react"
import Link from "next/link"

interface AnalyticsWidgetProps {
  blogId: string
  blogName: string
  totalViews: number
  recentViews: number
}

export default function AnalyticsWidget({ blogId, blogName, totalViews, recentViews }: AnalyticsWidgetProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Visao Geral
        </CardTitle>
        <CardDescription>Rapidas estatísticas de {blogName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold flex items-center justify-center">
              <Eye className="h-4 w-4 mr-1" />
              {totalViews}
            </div>
            <p className="text-xs text-muted-foreground">Total de visitas</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold flex items-center justify-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {recentViews}
            </div>
            <p className="text-xs text-muted-foreground">Ultimos 30 dias</p>
          </div>
        </div>

        <Button asChild className="w-full bg-transparent" variant="outline">
          <Link href={`/dashboard/blogs/${blogId}/analytics`}>Ver Analytics</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
