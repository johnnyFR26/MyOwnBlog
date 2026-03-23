import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myownblog.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "My Own Blog - Crie seu Blog Profissional",
    template: "%s | My Own Blog",
  },
  description:
    "Crie seus próprios blogs com cores, textos e links únicos e profissionais. Plataforma completa para criar e gerenciar blogs personalizados.",
  keywords: ["blog", "criar blog", "plataforma de blog", "blog profissional", "publicar artigos"],
  authors: [{ name: "Toasty Tech" }],
  creator: "Toasty Tech",
  publisher: "Toasty Tech",
  generator: "v0.app",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: baseUrl,
    title: "My Own Blog - Crie seu Blog Profissional",
    description: "Crie seus próprios blogs com cores, textos e links únicos e profissionais.",
    siteName: "My Own Blog",
    images: [
      {
        url: "/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "My Own Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Own Blog - Crie seu Blog Profissional",
    description: "Crie seus próprios blogs com cores, textos e links únicos e profissionais.",
    images: ["/placeholder-logo.png"],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: baseUrl,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
