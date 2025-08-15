"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ColorScheme {
  name: string
  description: string
  primary: string
  secondary: string
  accent: string
}

interface ColorSchemePresetsProps {
  onApplyScheme: (scheme: Omit<ColorScheme, "name" | "description">) => void
}

const COLOR_SCHEMES: ColorScheme[] = [
  {
    name: "Ocean Blue",
    description: "Professional and trustworthy",
    primary: "#3b82f6",
    secondary: "#1e40af",
    accent: "#06b6d4",
  },
  {
    name: "Forest Green",
    description: "Natural and calming",
    primary: "#10b981",
    secondary: "#065f46",
    accent: "#84cc16",
  },
  {
    name: "Sunset Orange",
    description: "Energetic and creative",
    primary: "#f97316",
    secondary: "#ea580c",
    accent: "#f59e0b",
  },
  {
    name: "Royal Purple",
    description: "Elegant and sophisticated",
    primary: "#8b5cf6",
    secondary: "#7c3aed",
    accent: "#ec4899",
  },
  {
    name: "Monochrome",
    description: "Clean and minimal",
    primary: "#6b7280",
    secondary: "#1f2937",
    accent: "#374151",
  },
  {
    name: "Cherry Red",
    description: "Bold and passionate",
    primary: "#ef4444",
    secondary: "#dc2626",
    accent: "#f97316",
  },
]

export default function ColorSchemePresets({ onApplyScheme }: ColorSchemePresetsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Scheme Presets</CardTitle>
        <CardDescription>Quick start with professionally designed color combinations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {COLOR_SCHEMES.map((scheme) => (
            <div key={scheme.name} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{scheme.name}</h4>
                  <p className="text-xs text-muted-foreground">{scheme.description}</p>
                </div>
                <div className="flex space-x-1">
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: scheme.primary }} />
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: scheme.secondary }} />
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: scheme.accent }} />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={() =>
                  onApplyScheme({
                    primary: scheme.primary,
                    secondary: scheme.secondary,
                    accent: scheme.accent,
                  })
                }
              >
                Apply Scheme
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
