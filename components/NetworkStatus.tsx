"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

// This component uses Network Information API to show connection status
export default function NetworkStatus() {
  const [networkInfo, setNetworkInfo] = useState<{
    type: string
    effectiveType: string
    downlink: number
    rtt: number
  } | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Check if browser supports Network Information API
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    const updateNetworkInfo = () => {
      if (connection) {
        setNetworkInfo({
          type: connection.type || "unknown",
          effectiveType: connection.effectiveType || "unknown",
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
        })
      }
    }

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // Initial check
    updateNetworkInfo()
    updateOnlineStatus()

    // Listen for network changes
    if (connection) {
      connection.addEventListener("change", updateNetworkInfo)
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    // Cleanup
    return () => {
      if (connection) {
        connection.removeEventListener("change", updateNetworkInfo)
      }
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  const getConnectionQuality = () => {
    if (!networkInfo) return "unknown"

    if (networkInfo.effectiveType === "4g" && networkInfo.downlink > 5) {
      return "excellent"
    } else if (networkInfo.effectiveType === "4g" || networkInfo.downlink > 2) {
      return "good"
    } else if (networkInfo.effectiveType === "3g") {
      return "fair"
    } else {
      return "poor"
    }
  }

  const quality = getConnectionQuality()
  const qualityColors = {
    excellent: "bg-green-100 text-green-800",
    good: "bg-blue-100 text-blue-800",
    fair: "bg-yellow-100 text-yellow-800",
    poor: "bg-red-100 text-red-800",
    unknown: "bg-gray-100 text-gray-800",
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
              <span className="font-medium">{isOnline ? "🌐 Online" : "📵 Offline"}</span>
            </div>

            {networkInfo && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>📶 {networkInfo.effectiveType?.toUpperCase()}</span>
                <span>⬇️ {networkInfo.downlink} Mbps</span>
                <span>⏱️ {networkInfo.rtt}ms</span>
              </div>
            )}
          </div>

          <div className={`px-3 py-1 rounded-full text-sm font-medium ${qualityColors[quality]}`}>
            {quality === "excellent" && "🚀 Excellent"}
            {quality === "good" && "✅ Good"}
            {quality === "fair" && "⚠️ Fair"}
            {quality === "poor" && "🐌 Poor"}
            {quality === "unknown" && "❓ Unknown"}
          </div>
        </div>

        {quality === "poor" && (
          <div className="mt-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
            💡 Tip: Poor connection detected. Consider downloading offline study materials!
          </div>
        )}
      </CardContent>
    </Card>
  )
}
