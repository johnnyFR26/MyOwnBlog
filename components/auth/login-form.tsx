"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { signInAction } from "@/lib/actions"
import { AlertCircle, Mail, Lock } from "lucide-react"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await signInAction(formData)
      if (result?.error) {
        setError(result.error)
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Bem-vindo de volta</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required className="pl-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Senha
              </Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required className="pl-10" />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading} size="lg">
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <Separator />
          <div className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline font-medium">
              Cadastre-se aqui
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
