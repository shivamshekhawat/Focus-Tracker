"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DistractionDetectorProps {
  setIsFocused: (focused: boolean) => void
  setDistractionCount: (count: number) => void
  distractionCount: number
}

// This component uses Intersection Observer API to detect when user scrolls away
export default function DistractionDetector({
  setIsFocused,
  setDistractionCount,
  distractionCount,
}: DistractionDetectorProps) {
  const focusAreaRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Create Intersection Observer to watch the focus area
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If the focus area is visible, user is focused
          // If it's not visible (scrolled away), user is distracted
          const isVisible = entry.isIntersecting
          setIsFocused(isVisible)

          // Count distractions when user scrolls away
          if (!isVisible) {
            setDistractionCount(distractionCount + 1)
          }
        })
      },
      {
        // Trigger when 50% of the element is visible
        threshold: 0.5,
        // Add some margin to make detection more sensitive
        rootMargin: "-50px",
      },
    )

    // Start observing the focus area
    if (focusAreaRef.current) {
      observerRef.current.observe(focusAreaRef.current)
    }

    // Cleanup observer when component unmounts
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [distractionCount, setIsFocused, setDistractionCount])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">👁️ Distraction Detector</CardTitle>
      </CardHeader>
      <CardContent>
        {/* This is the "focus area" that we monitor */}
        <div
          ref={focusAreaRef}
          className="min-h-[200px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 border-2 border-dashed border-blue-300"
        >
          <div className="text-center space-y-4">
            <div className="text-4xl">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800">Focus Zone</h3>
            <p className="text-gray-600">
              Keep this area visible to maintain focus!
              <br />
              The app detects when you scroll away and counts it as a distraction.
            </p>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2">How it works:</h4>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>
                  • Uses <strong>Intersection Observer API</strong>
                </li>
                <li>• Monitors if this focus area is visible</li>
                <li>• Counts distractions when you scroll away</li>
                <li>• Helps you stay aware of your attention</li>
              </ul>
            </div>

            <div className="text-lg font-semibold text-blue-600">Stay focused and keep this area in view! 💪</div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500 text-center">
          💡 Try scrolling up or down to see the distraction detection in action!
        </div>
      </CardContent>
    </Card>
  )
}
