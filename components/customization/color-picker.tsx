"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
  description?: string
}

const PRESET_COLORS = [
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#10b981", // Green
  "#f59e0b", // Yellow
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#84cc16", // Lime
  "#ec4899", // Pink
  "#6b7280", // Gray
  "#1f2937", // Dark Gray
  "#000000", // Black
]

export default function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      <div className="flex items-center space-x-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-12 h-10 p-0 border-2 bg-transparent"
              style={{ backgroundColor: value, borderColor: value }}
            >
              <span className="sr-only">Pick color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-4">
              <div>
                <Label htmlFor="color-input" className="text-sm">
                  Custom Color
                </Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    id="color-input"
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-12 h-8 p-0 border-0"
                  />
                  <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">Preset Colors</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {PRESET_COLORS.map((color) => (
                    <Button
                      key={color}
                      variant="outline"
                      className="w-8 h-8 p-0 border-2 bg-transparent"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        onChange(color)
                        setIsOpen(false)
                      }}
                    >
                      <span className="sr-only">Select {color}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
    </div>
  )
}
