import { Heart } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <Separator className="mb-4" />
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex items-center space-x-2">
            
            <span className="text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Toasty Tech
            </span>
          </div>
          <p className="text-xs text-muted-foreground">© 2025 Toasty Tech. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
