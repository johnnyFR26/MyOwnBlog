"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { signUpAction } from "@/lib/actions"
import { AlertCircle, User, Mail, Lock } from "lucide-react"

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await signUpAction(formData)
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
          <CardTitle className="text-3xl font-bold">Criar conta</CardTitle>
          <CardDescription>Crie sua conta para começar a usar a plataforma</CardDescription>
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
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome
              </Label>
              <Input id="name" name="name" type="text" placeholder="Seu nome completo" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Senha
              </Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading} size="lg">
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          <Separator />

          <div className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Faça login aqui
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
