'use client'
import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

export default function useLenis() {
  const lenisRef = useRef(null)

  useEffect(() => {
    if (!window || typeof window === 'undefined') return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    })

    lenisRef.current = lenis

    const raf = (time) => {
      lenisRef.current?.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenisRef.current?.destroy()
    }
  }, [])
}
