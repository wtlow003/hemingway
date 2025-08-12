"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
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
  
  // Define which providers need inversion in dark mode
  const providersNeedingInversion = ["OpenAI", "Google", "Anthropic", "Moonshot"]
  const shouldInvert = theme === "dark" && provider && providersNeedingInversion.includes(provider)
  
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
        theme === "dark" && "bg-background/10 rounded-sm p-0.5"
      )}
    />
  )
}