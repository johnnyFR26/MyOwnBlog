"use client"

import type React from "react"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="light" data-theme="light">
      <style jsx global>{`
        html[data-theme="light"] {
          color-scheme: light;
        }
        .light {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
        }
      `}</style>
      {children}
    </div>
  )
}
