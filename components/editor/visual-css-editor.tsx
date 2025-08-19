"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Palette, Type, Layout, BracketsIcon as Spacing, Code2 } from "lucide-react"

interface CSSRule {
  selector: string
  properties: Record<string, string>
}

interface VisualCSSEditorProps {
  initialCSS?: string
  onCSSChange: (css: string) => void
}

const HTML_ELEMENTS = [
  { value: "h1", label: "Título 1 (H1)", icon: "H1" },
  { value: "h2", label: "Título 2 (H2)", icon: "H2" },
  { value: "h3", label: "Título 3 (H3)", icon: "H3" },
  { value: "p", label: "Parágrafo", icon: "P" },
  { value: "strong", label: "Negrito", icon: "B" },
  { value: "em", label: "Itálico", icon: "I" },
  { value: "a", label: "Links", icon: "🔗" },
  { value: "ul", label: "Lista", icon: "•" },
  { value: "ol", label: "Lista Numerada", icon: "1." },
  { value: "blockquote", label: "Citação", icon: "❝" },
  { value: "code", label: "Código", icon: "</>" },
  { value: "img", label: "Imagens", icon: "🖼" },
]

const FONT_FAMILIES = [
  "Arial, sans-serif",
  "Georgia, serif",
  "Times New Roman, serif",
  "Helvetica, sans-serif",
  "Verdana, sans-serif",
  "Courier New, monospace",
  "Impact, sans-serif",
  "Comic Sans MS, cursive",
]

export default function VisualCSSEditor({ initialCSS = "", onCSSChange }: VisualCSSEditorProps) {
  const [selectedElement, setSelectedElement] = useState<string>("h1")
  const [cssRules, setCSSRules] = useState<CSSRule[]>([])
  const [showPreview, setShowPreview] = useState(false)

  // Parse initial CSS
  useEffect(() => {
    if (initialCSS) {
      // Simple CSS parser - in production, you'd want a more robust parser
      const rules: CSSRule[] = []
      const ruleMatches = initialCSS.match(/([^{]+)\{([^}]+)\}/g)

      if (ruleMatches) {
        ruleMatches.forEach((rule) => {
          const [selector, properties] = rule.split("{")
          const props: Record<string, string> = {}

          properties
            .replace("}", "")
            .split(";")
            .forEach((prop) => {
              const [key, value] = prop.split(":")
              if (key && value) {
                props[key.trim()] = value.trim()
              }
            })

          rules.push({
            selector: selector.trim(),
            properties: props,
          })
        })
      }

      setCSSRules(rules)
    }
  }, [initialCSS])

  // Generate CSS from rules
  const generateCSS = () => {
    return cssRules
      .map((rule) => {
        const properties = Object.entries(rule.properties)
          .map(([key, value]) => `  ${key}: ${value};`)
          .join("\n")

        return `${rule.selector} {\n${properties}\n}`
      })
      .join("\n\n")
  }

  // Update CSS when rules change
  useEffect(() => {
    const css = generateCSS()
    onCSSChange(css)
  }, [cssRules, onCSSChange])

  // Get current rule for selected element
  const getCurrentRule = () => {
    return (
      cssRules.find((rule) => rule.selector === selectedElement) || {
        selector: selectedElement,
        properties: {},
      }
    )
  }

  // Update rule properties
  const updateRule = (property: string, value: string) => {
    setCSSRules((prev) => {
      const newRules = [...prev]
      const existingIndex = newRules.findIndex((rule) => rule.selector === selectedElement)

      if (existingIndex >= 0) {
        newRules[existingIndex].properties[property] = value
      } else {
        newRules.push({
          selector: selectedElement,
          properties: { [property]: value },
        })
      }

      return newRules
    })
  }

  // Remove property
  const removeProperty = (property: string) => {
    setCSSRules((prev) => {
      const newRules = [...prev]
      const existingIndex = newRules.findIndex((rule) => rule.selector === selectedElement)

      if (existingIndex >= 0) {
        delete newRules[existingIndex].properties[property]
        if (Object.keys(newRules[existingIndex].properties).length === 0) {
          newRules.splice(existingIndex, 1)
        }
      }

      return newRules
    })
  }

  const currentRule = getCurrentRule()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Editor Visual de Estilos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Element Selector */}
        <div className="space-y-2">
          <Label>Selecionar Elemento para Estilizar</Label>
          <Select value={selectedElement} onValueChange={setSelectedElement}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HTML_ELEMENTS.map((element) => (
                <SelectItem key={element.value} value={element.value}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{element.icon}</span>
                    {element.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Estilizando: <code className="bg-muted px-1 rounded">{selectedElement}</code>
          </p>
        </div>

        <Separator />

        <Tabs defaultValue="typography" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="typography" className="flex items-center gap-1">
              <Type className="h-3 w-3" />
              Texto
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-1">
              <Palette className="h-3 w-3" />
              Cores
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-1">
              <Layout className="h-3 w-3" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="spacing" className="flex items-center gap-1">
              <Spacing className="h-3 w-3" />
              Espaçamento
            </TabsTrigger>
          </TabsList>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Família da Fonte</Label>
                <Select
                  value={currentRule.properties["font-family"] || ""}
                  onValueChange={(value) => updateRule("font-family", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font} value={font}>
                        <span style={{ fontFamily: font }}>{font.split(",")[0]}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Peso da Fonte</Label>
                <Select
                  value={currentRule.properties["font-weight"] || ""}
                  onValueChange={(value) => updateRule("font-weight", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Peso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">Leve (300)</SelectItem>
                    <SelectItem value="400">Normal (400)</SelectItem>
                    <SelectItem value="500">Médio (500)</SelectItem>
                    <SelectItem value="600">Semi-negrito (600)</SelectItem>
                    <SelectItem value="700">Negrito (700)</SelectItem>
                    <SelectItem value="800">Extra-negrito (800)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tamanho da Fonte: {currentRule.properties["font-size"] || "16px"}</Label>
              <Slider
                value={[Number.parseInt(currentRule.properties["font-size"]?.replace("px", "") || "16")]}
                onValueChange={([value]) => updateRule("font-size", `${value}px`)}
                max={72}
                min={8}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Alinhamento do Texto</Label>
              <Select
                value={currentRule.properties["text-align"] || ""}
                onValueChange={(value) => updateRule("text-align", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Alinhamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="center">Centro</SelectItem>
                  <SelectItem value="right">Direita</SelectItem>
                  <SelectItem value="justify">Justificado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cor do Texto</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={currentRule.properties["color"] || "#000000"}
                    onChange={(e) => updateRule("color", e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={currentRule.properties["color"] || ""}
                    onChange={(e) => updateRule("color", e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cor de Fundo</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={currentRule.properties["background-color"] || "#ffffff"}
                    onChange={(e) => updateRule("background-color", e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={currentRule.properties["background-color"] || ""}
                    onChange={(e) => updateRule("background-color", e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cor da Borda</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={currentRule.properties["border-color"] || "#cccccc"}
                  onChange={(e) => updateRule("border-color", e.target.value)}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  value={currentRule.properties["border-color"] || ""}
                  onChange={(e) => updateRule("border-color", e.target.value)}
                  placeholder="#cccccc"
                  className="flex-1"
                />
              </div>
            </div>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-4">
            <div className="space-y-2">
              <Label>Largura da Borda: {currentRule.properties["border-width"] || "0px"}</Label>
              <Slider
                value={[Number.parseInt(currentRule.properties["border-width"]?.replace("px", "") || "0")]}
                onValueChange={([value]) => updateRule("border-width", `${value}px`)}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Estilo da Borda</Label>
              <Select
                value={currentRule.properties["border-style"] || ""}
                onValueChange={(value) => updateRule("border-style", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estilo da borda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  <SelectItem value="solid">Sólida</SelectItem>
                  <SelectItem value="dashed">Tracejada</SelectItem>
                  <SelectItem value="dotted">Pontilhada</SelectItem>
                  <SelectItem value="double">Dupla</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Raio da Borda: {currentRule.properties["border-radius"] || "0px"}</Label>
              <Slider
                value={[Number.parseInt(currentRule.properties["border-radius"]?.replace("px", "") || "0")]}
                onValueChange={([value]) => updateRule("border-radius", `${value}px`)}
                max={50}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </TabsContent>

          {/* Spacing Tab */}
          <TabsContent value="spacing" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Margem: {currentRule.properties["margin"] || "0px"}</Label>
                <Slider
                  value={[Number.parseInt(currentRule.properties["margin"]?.replace("px", "") || "0")]}
                  onValueChange={([value]) => updateRule("margin", `${value}px`)}
                  max={100}
                  min={0}
                  step={4}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Preenchimento: {currentRule.properties["padding"] || "0px"}</Label>
                <Slider
                  value={[Number.parseInt(currentRule.properties["padding"]?.replace("px", "") || "0")]}
                  onValueChange={([value]) => updateRule("padding", `${value}px`)}
                  max={100}
                  min={0}
                  step={4}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Altura da Linha: {currentRule.properties["line-height"] || "1.5"}</Label>
              <Slider
                value={[Number.parseFloat(currentRule.properties["line-height"] || "1.5") * 10]}
                onValueChange={([value]) => updateRule("line-height", (value / 10).toString())}
                max={30}
                min={10}
                step={1}
                className="w-full"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Applied Styles */}
        {Object.keys(currentRule.properties).length > 0 && (
          <div className="space-y-2">
            <Label>Estilos Aplicados</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(currentRule.properties).map(([property, value]) => (
                <Badge
                  key={property}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeProperty(property)}
                >
                  {property}: {value} ×
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Clique em um estilo para removê-lo</p>
          </div>
        )}

        {/* CSS Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>CSS Gerado</Label>
            <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
              <Code2 className="h-4 w-4 mr-2" />
              {showPreview ? "Ocultar" : "Ver"} CSS
            </Button>
          </div>

          {showPreview && (
            <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-40">
              <code>{generateCSS() || "/* Nenhum estilo aplicado */"}</code>
            </pre>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
