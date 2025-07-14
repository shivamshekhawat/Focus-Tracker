"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FocusTimerProps {
  focusTime: number
  setFocusTime: (time: number) => void
  isFocused: boolean
}

// This component uses Background Tasks API to handle timer updates efficiently
export default function FocusTimer({ focusTime, setFocusTime, isFocused }: FocusTimerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [canvasSize] = useState(200)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Background task function - this runs when browser has idle time
  const scheduleBackgroundTask = (callback: () => void) => {
    // Check if browser supports requestIdleCallback (Background Tasks API)
    if ("requestIdleCallback" in window) {
      ;(window as any).requestIdleCallback(callback)
    } else {
      // Fallback for browsers that don't support it
      setTimeout(callback, 0)
    }
  }

  // Start the timer
  const startTimer = () => {
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      // Use background task to update time - this won't block the UI
      scheduleBackgroundTask(() => {
        setFocusTime((prev) => prev + 1)
      })
    }, 1000)
  }

  // Stop the timer
  const stopTimer = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  // Reset timer
  const resetTimer = () => {
    stopTimer()
    setFocusTime(0)
  }

  // Draw timer on canvas using Canvas API
  const drawTimer = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvasSize / 2
    const centerY = canvasSize / 2
    const radius = 80

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize)

    // Draw background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 8
    ctx.stroke()

    // Draw progress arc based on focus time
    // Let's say 25 minutes (1500 seconds) is a full circle
    const maxTime = 1500 // 25 minutes in seconds
    const progress = Math.min(focusTime / maxTime, 1)
    const endAngle = -Math.PI / 2 + 2 * Math.PI * progress

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle)
    ctx.strokeStyle = isFocused ? "#10b981" : "#f59e0b"
    ctx.lineWidth = 8
    ctx.lineCap = "round"
    ctx.stroke()

    // Draw time text in center
    ctx.fillStyle = "#374151"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    const minutes = Math.floor(focusTime / 60)
    const seconds = focusTime % 60
    const timeText = `${minutes}:${seconds.toString().padStart(2, "0")}`
    ctx.fillText(timeText, centerX, centerY)

    // Draw status text
    ctx.font = "14px Arial"
    ctx.fillStyle = isFocused ? "#10b981" : "#f59e0b"
    ctx.fillText(isFocused ? "FOCUSED" : "DISTRACTED", centerX, centerY + 30)
  }

  // Redraw canvas when time or focus state changes
  useEffect(() => {
    drawTimer()
  }, [focusTime, isFocused])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">⏱️ Focus Timer</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {/* Canvas for visual timer - this uses Canvas API */}
        <canvas ref={canvasRef} width={canvasSize} height={canvasSize} className="mx-auto border rounded-full" />

        <div className="flex gap-2 justify-center">
          <Button
            onClick={isRunning ? stopTimer : startTimer}
            className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
          >
            {isRunning ? "⏸️ Pause" : "▶️ Start"}
          </Button>
          <Button onClick={resetTimer} variant="outline">
            🔄 Reset
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          <p>Target: 25 minutes (Pomodoro technique)</p>
          <p className={`font-semibold ${isFocused ? "text-green-600" : "text-yellow-600"}`}>
            Status: {isFocused ? "Focused 🎯" : "Distracted 😵‍💫"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
