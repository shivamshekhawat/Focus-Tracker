"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductivityChartProps {
  focusTime: number
  distractionCount: number
}

// This component creates a productivity chart using Canvas API
export default function ProductivityChart({ focusTime, distractionCount }: ProductivityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Function to draw the chart
  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Chart data - let's create some sample data plus current session
    const chartData = [
      { day: "Mon", focus: 45, distractions: 3 },
      { day: "Tue", focus: 60, distractions: 2 },
      { day: "Wed", focus: 30, distractions: 5 },
      { day: "Thu", focus: 75, distractions: 1 },
      { day: "Fri", focus: 40, distractions: 4 },
      { day: "Sat", focus: 90, distractions: 1 },
      { day: "Today", focus: Math.floor(focusTime / 60), distractions: distractionCount },
    ]

    const maxFocus = Math.max(...chartData.map((d) => d.focus), 100)
    const barWidth = (width - 100) / chartData.length
    const chartHeight = height - 80

    // Draw bars for focus time
    chartData.forEach((data, index) => {
      const x = 50 + index * barWidth
      const barHeight = (data.focus / maxFocus) * chartHeight
      const y = height - 40 - barHeight

      // Focus time bar (green)
      ctx.fillStyle = data.day === "Today" ? "#10b981" : "#6ee7b7"
      ctx.fillRect(x, y, barWidth * 0.4, barHeight)

      // Distraction indicator (red dots)
      ctx.fillStyle = "#ef4444"
      for (let i = 0; i < data.distractions; i++) {
        ctx.beginPath()
        ctx.arc(x + barWidth * 0.2, y - 10 - i * 8, 3, 0, 2 * Math.PI)
        ctx.fill()
      }

      // Day labels
      ctx.fillStyle = "#374151"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(data.day, x + barWidth * 0.2, height - 20)

      // Focus time labels
      ctx.fillText(`${data.focus}m`, x + barWidth * 0.2, y - 20)
    })

    // Chart title and labels
    ctx.fillStyle = "#1f2937"
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "left"
    ctx.fillText("Weekly Focus Time (minutes)", 20, 25)

    // Y-axis labels
    ctx.font = "10px Arial"
    ctx.fillStyle = "#6b7280"
    for (let i = 0; i <= 5; i++) {
      const value = (maxFocus / 5) * i
      const y = height - 40 - (i * chartHeight) / 5
      ctx.fillText(Math.round(value).toString(), 10, y + 3)
    }

    // Legend
    ctx.fillStyle = "#10b981"
    ctx.fillRect(width - 120, 20, 15, 10)
    ctx.fillStyle = "#374151"
    ctx.font = "12px Arial"
    ctx.fillText("Focus Time", width - 100, 30)

    ctx.fillStyle = "#ef4444"
    ctx.beginPath()
    ctx.arc(width - 112, 45, 4, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = "#374151"
    ctx.fillText("Distractions", width - 100, 50)
  }

  // Redraw chart when data changes
  useEffect(() => {
    drawChart()
  }, [focusTime, distractionCount])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">📈 Productivity Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas ref={canvasRef} width={500} height={300} className="w-full border rounded" />
        <div className="mt-4 text-sm text-gray-600">
          <p>📊 Track your daily focus patterns</p>
          <p>🔴 Red dots = distractions detected</p>
        </div>
      </CardContent>
    </Card>
  )
}
