"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Code,
  Quote,
  ImageIcon,
  SeparatorVerticalIcon as Separator,
} from "lucide-react"

interface ShortcutOption {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  template: string
  cursorOffset?: number
}

const shortcuts: ShortcutOption[] = [
  {
    id: "h1",
    label: "Título 1",
    description: "Título principal",
    icon: <Heading1 className="h-4 w-4" />,
    template: "<h1></h1>",
    cursorOffset: -5,
  },
  {
    id: "h2",
    label: "Título 2",
    description: "Subtítulo",
    icon: <Heading2 className="h-4 w-4" />,
    template: "<h2></h2>",
    cursorOffset: -5,
  },
  {
    id: "h3",
    label: "Título 3",
    description: "Título menor",
    icon: <Heading3 className="h-4 w-4" />,
    template: "<h3></h3>",
    cursorOffset: -5,
  },
  {
    id: "p",
    label: "Parágrafo",
    description: "Texto normal",
    icon: <span className="text-xs font-mono">P</span>,
    template: "<p></p>",
    cursorOffset: -4,
  },
  {
    id: "bold",
    label: "Negrito",
    description: "Texto em negrito",
    icon: <Bold className="h-4 w-4" />,
    template: "<strong></strong>",
    cursorOffset: -9,
  },
  {
    id: "italic",
    label: "Itálico",
    description: "Texto em itálico",
    icon: <Italic className="h-4 w-4" />,
    template: "<em></em>",
    cursorOffset: -5,
  },
  {
    id: "link",
    label: "Link",
    description: "Link para URL",
    icon: <Link className="h-4 w-4" />,
    template: '<a href=""></a>',
    cursorOffset: -6,
  },
  {
    id: "ul",
    label: "Lista",
    description: "Lista com marcadores",
    icon: <List className="h-4 w-4" />,
    template: "<ul>\n  <li></li>\n</ul>",
    cursorOffset: -11,
  },
  {
    id: "ol",
    label: "Lista Numerada",
    description: "Lista numerada",
    icon: <ListOrdered className="h-4 w-4" />,
    template: "<ol>\n  <li></li>\n</ol>",
    cursorOffset: -11,
  },
  {
    id: "code",
    label: "Código",
    description: "Código inline",
    icon: <Code className="h-4 w-4" />,
    template: "<code></code>",
    cursorOffset: -7,
  },
  {
    id: "pre",
    label: "Bloco de Código",
    description: "Bloco de código",
    icon: <Code className="h-4 w-4" />,
    template: "<pre><code></code></pre>",
    cursorOffset: -13,
  },
  {
    id: "blockquote",
    label: "Citação",
    description: "Bloco de citação",
    icon: <Quote className="h-4 w-4" />,
    template: "<blockquote></blockquote>",
    cursorOffset: -13,
  },
  {
    id: "img",
    label: "Imagem",
    description: "Inserir imagem",
    icon: <ImageIcon className="h-4 w-4" />,
    template: '<img src="/placeholder.svg" alt="" />',
    cursorOffset: -12,
  },
  {
    id: "hr",
    label: "Separador",
    description: "Linha horizontal",
    icon: <Separator className="h-4 w-4" />,
    template: "<hr />",
    cursorOffset: 0,
  },
  {
    id: "br",
    label: "Quebra de Linha",
    description: "Nova linha",
    icon: <span className="text-xs font-mono">↵</span>,
    template: "<br />",
    cursorOffset: 0,
  },
]

interface KeyboardShortcutsProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onInsert: (text: string, cursorOffset?: number) => void
}

export default function KeyboardShortcuts({ textareaRef, onInsert }: KeyboardShortcutsProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const cursorPosition = textarea.selectionStart
        const textBeforeCursor = textarea.value.substring(0, cursorPosition)
        const lastChar = textBeforeCursor[textBeforeCursor.length - 1]

        // Only trigger if "/" is at start of line or after whitespace
        if (cursorPosition === 0 || lastChar === "\n" || lastChar === " ") {
          e.preventDefault()

          // Calculate position for popover
          const rect = textarea.getBoundingClientRect()
          const textareaStyle = window.getComputedStyle(textarea)
          const lineHeight = Number.parseInt(textareaStyle.lineHeight)
          const fontSize = Number.parseInt(textareaStyle.fontSize)

          // Rough calculation of cursor position
          const lines = textBeforeCursor.split("\n")
          const currentLine = lines.length - 1
          const currentColumn = lines[lines.length - 1].length

          setPosition({
            top: rect.top + currentLine * lineHeight + lineHeight + 5,
            left: rect.left + currentColumn * (fontSize * 0.6) + 10,
          })

          setOpen(true)
          setSearch("")
        }
      } else if (e.key === "Escape" && open) {
        setOpen(false)
      }
    }

    textarea.addEventListener("keydown", handleKeyDown)
    return () => textarea.removeEventListener("keydown", handleKeyDown)
  }, [textareaRef, open])

  const handleSelect = (shortcut: ShortcutOption) => {
    setOpen(false)
    onInsert(shortcut.template, shortcut.cursorOffset)
  }

  const filteredShortcuts = shortcuts.filter(
    (shortcut) =>
      shortcut.label.toLowerCase().includes(search.toLowerCase()) ||
      shortcut.description.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            pointerEvents: "none",
            zIndex: 50,
          }}
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align="start"
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          zIndex: 50,
        }}
      >
        <Command>
          <CommandInput placeholder="Buscar atalhos..." value={search} onValueChange={setSearch} autoFocus />
          <CommandList>
            <CommandEmpty>Nenhum atalho encontrado.</CommandEmpty>
            <CommandGroup heading="Formatação">
              {filteredShortcuts.map((shortcut) => (
                <CommandItem
                  key={shortcut.id}
                  onSelect={() => handleSelect(shortcut)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  {shortcut.icon}
                  <div className="flex-1">
                    <div className="font-medium">{shortcut.label}</div>
                    <div className="text-xs text-muted-foreground">{shortcut.description}</div>
                  </div>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    {shortcut.template.length > 20 ? shortcut.template.substring(0, 20) + "..." : shortcut.template}
                  </code>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
