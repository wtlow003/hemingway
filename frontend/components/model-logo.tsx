"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ModelLogoProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  provider?: string
}

export function ModelLogo({ src, alt, width, height, className, provider }: ModelLogoProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Ensure theme is only used after hydration
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Define which providers need inversion in dark mode
  const providersNeedingInversion = ["OpenAI", "Google", "Anthropic", "Moonshot"]
  const shouldInvert = mounted && theme === "dark" && provider && providersNeedingInversion.includes(provider)
  const shouldApplyBackground = mounted && theme === "dark"
  
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        className,
        // Apply inversion and brightness adjustments for better visibility in dark mode
        shouldInvert && "invert brightness-0 contrast-100",
        // Add a subtle background for better logo visibility
        shouldApplyBackground && "bg-background/10 rounded-sm p-0.5"
      )}
    />
  )
}