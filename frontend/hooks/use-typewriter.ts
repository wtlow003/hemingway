import { useState, useEffect, useRef } from 'react'

interface UseTypewriterOptions {
  initialText: string
  typewriterText: string
  initialDelay: number
  typingSpeed: number
  backtrackChance: number
  backtrackLength: number
  completePause: number
}

export function useTypewriter({
  initialText,
  typewriterText,
  initialDelay,
  typingSpeed,
  backtrackChance,
  backtrackLength,
  completePause
}: UseTypewriterOptions) {
  const [displayText, setDisplayText] = useState(initialText)
  const [isTyping, setIsTyping] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const indexRef = useRef(0)
  const phaseRef = useRef<'initial' | 'typing' | 'complete'>('initial')
  const isActiveRef = useRef(true)

  const clearCurrentTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const scheduleNext = (callback: () => void, delay: number) => {
    clearCurrentTimeout()
    timeoutRef.current = setTimeout(callback, delay)
  }

  const typeNext = () => {
    if (!isActiveRef.current) return

    if (phaseRef.current === 'typing') {
      const currentIndex = indexRef.current
      
      // Random backtrack
      if (currentIndex > 0 && Math.random() < backtrackChance) {
        const backtrackCount = Math.min(backtrackLength, currentIndex)
        indexRef.current = currentIndex - backtrackCount
        setDisplayText(typewriterText.substring(0, indexRef.current))
        scheduleNext(typeNext, typingSpeed)
        return
      }

      if (currentIndex < typewriterText.length) {
        indexRef.current = currentIndex + 1
        setDisplayText(typewriterText.substring(0, indexRef.current))
        scheduleNext(typeNext, typingSpeed)
      } else {
        // Typing complete, start backtracking all the way
        phaseRef.current = 'complete'
        scheduleNext(backtrackAll, completePause)
      }
    }
  }

  const backtrackAll = () => {
    if (!isActiveRef.current) return

    const currentIndex = indexRef.current
    if (currentIndex > 0) {
      indexRef.current = currentIndex - 1
      setDisplayText(typewriterText.substring(0, indexRef.current))
      scheduleNext(backtrackAll, typingSpeed * 1.5) // Slower backtracking
    } else {
      // Backtracking complete, reset to initial
      phaseRef.current = 'initial'
      indexRef.current = 0
      setDisplayText(initialText)
      setIsTyping(false)
      scheduleNext(startCycle, initialDelay)
    }
  }

  const startCycle = () => {
    if (!isActiveRef.current) return
    
    phaseRef.current = 'typing'
    indexRef.current = 0
    setIsTyping(true)
    setDisplayText('')
    scheduleNext(typeNext, typingSpeed)
  }

  const reset = () => {
    clearCurrentTimeout()
    phaseRef.current = 'initial'
    indexRef.current = 0
    setDisplayText(initialText)
    setIsTyping(false)
    isActiveRef.current = true
    scheduleNext(startCycle, initialDelay)
  }

  const stop = () => {
    isActiveRef.current = false
    clearCurrentTimeout()
    setDisplayText(initialText)
    setIsTyping(false)
  }

  useEffect(() => {
    reset()
    
    return () => {
      clearCurrentTimeout()
      isActiveRef.current = false
    }
  }, [initialText, typewriterText, initialDelay, typingSpeed, backtrackChance, backtrackLength, completePause])

  return {
    displayText,
    isTyping,
    reset,
    stop
  }
}
