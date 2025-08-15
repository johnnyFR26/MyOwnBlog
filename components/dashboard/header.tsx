import { Button } from "@/components/ui/button"
import { Settings, LogOut, User } from "lucide-react"
import { getUserSession } from "@/lib/session"
import { signOutAction } from "@/lib/actions"
import { ThemeToggle } from "@/components/theme-toggle"

export default async function DashboardHeader() {
  const user = await getUserSession()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Blog Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user.name}</span>
            </div>
          )}
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
          <form action={signOutAction}>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
