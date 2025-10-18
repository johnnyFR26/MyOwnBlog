"use client"

import { useState, type KeyboardEvent } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CategoryInputProps {
  categories: string[]
  onChange: (categories: string[]) => void
}

export default function CategoryInput({ categories, onChange }: CategoryInputProps) {
  const [inputValue, setInputValue] = useState("")

  const addCategory = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !categories.includes(trimmed)) {
      onChange([...categories, trimmed])
      setInputValue("")
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    onChange(categories.filter((cat) => cat !== categoryToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addCategory()
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="categories">Categorias/Tags</Label>
      <div className="flex gap-2">
        <Input
          id="categories"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite uma categoria e pressione Enter"
        />
        <Button type="button" variant="outline" size="icon" onClick={addCategory} disabled={!inputValue.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1">
              {category}
              <button
                type="button"
                onClick={() => removeCategory(category)}
                className="ml-1 hover:text-destructive"
                aria-label={`Remove ${category}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Adicione categorias para organizar seus posts e facilitar a busca dos leitores
      </p>
    </div>
  )
}
