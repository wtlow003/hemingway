import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Space_Grotesk } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "Optimize Your Prompts Seaminglessly",
  description: "Optimize your prompts for individual models and get better results",
  generator: 'Next.js',
  openGraph: {
    title: "Optimize Your Prompts Seaminglessly",
    description: "Optimize your prompts for individual models and get better results",
    url: "https://hemingway.onrender.com",
    siteName: "Hemingway",
    images: [
      {
        url: "https://hemingway.onrender.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${spaceGrotesk.variable}`}>
      <link rel="icon" href="/favicon.ico" />
      <body className={GeistSans.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
