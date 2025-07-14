"use client"

import { useState } from "react"
import LocationTracker from "@/components/LocationTracker"
import FocusTimer from "@/components/FocusTimer"
import ProductivityChart from "@/components/ProductivityChart"
import NetworkStatus from "@/components/NetworkStatus"
import DistractionDetector from "@/components/DistractionDetector"

// Main app component - this is like the "brain" of our app
export default function FocusTrackerApp() {
  // State to track if user is focused or not
  const [isFocused, setIsFocused] = useState(true)
  const [focusTime, setFocusTime] = useState(0)
  const [distractionCount, setDistractionCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 Focus Tracker</h1>
          <p className="text-gray-600">
            Stay productive with location tracking, focus monitoring, and network awareness!
          </p>
        </div>

        {/* Network Status - shows at top so user knows connection quality */}
        <NetworkStatus />

        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left side - Location and Timer */}
          <div className="space-y-6">
            <LocationTracker />
            <FocusTimer focusTime={focusTime} setFocusTime={setFocusTime} isFocused={isFocused} />
          </div>

          {/* Right side - Chart */}
          <div>
            <ProductivityChart focusTime={focusTime} distractionCount={distractionCount} />
          </div>
        </div>

        {/* Distraction detector - this monitors if user scrolls away */}
        <DistractionDetector
          setIsFocused={setIsFocused}
          setDistractionCount={setDistractionCount}
          distractionCount={distractionCount}
        />

        {/* Stats summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-xl font-semibold mb-4">📊 Today's Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.floor(focusTime / 60)}m {focusTime % 60}s
              </div>
              <div className="text-sm text-gray-600">Focus Time</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{distractionCount}</div>
              <div className="text-sm text-gray-600">Distractions</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {distractionCount > 0 ? Math.round((focusTime / (focusTime + distractionCount * 30)) * 100) : 100}%
              </div>
              <div className="text-sm text-gray-600">Focus Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
