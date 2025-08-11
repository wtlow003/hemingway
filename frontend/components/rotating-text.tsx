"use client"

import { useState, useEffect } from "react"

interface RotatingTextProps {
  phrases: string[]
  interval?: number
  className?: string
}

export function RotatingText({ phrases, interval = 2500, className = "" }: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (phrases.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length)
    }, interval)

    return () => clearInterval(timer)
  }, [phrases.length, interval])

  return <span className={className}>{phrases[currentIndex]}</span>
}

// Predefined tech phrases for analysis
export const ANALYSIS_PHRASES = [
  "ANALYZING PROMPT...",
  "COMPILING COFFEE...",
  "MINING FOR INSIGHTS...",
  "FINDING PATTERNS...",
  "SPINNING UP SECOND BRAIN...",
  "BUILDING THOUGHT VECTORS...",
  "GENERATING OH-SO-SMART RESPONSES...",
  "LOADING FUTURISTIC COMPUTATIONS...",
  "TRANSLATING THOUGHTS INTO PROMPT..."
];

