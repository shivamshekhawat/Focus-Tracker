"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// This component uses the Geolocation API to track if user is in their study spot
export default function LocationTracker() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [studyLocation, setStudyLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isAtStudySpot, setIsAtStudySpot] = useState(false)
  const [error, setError] = useState<string>("")

  // Function to get current location using Geolocation API
  const getCurrentLocation = () => {
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setLocation(newLocation)
        setError("")

        // Check if we're at study spot (within 100 meters)
        if (studyLocation) {
          const distance = calculateDistance(newLocation, studyLocation)
          setIsAtStudySpot(distance < 0.1) // 0.1 km = 100 meters
        }
      },
      (error) => {
        setError("Unable to get location: " + error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    )
  }

  // Simple function to calculate distance between two points
  // This is basic math - in real apps you might use more complex formulas
  const calculateDistance = (pos1: { lat: number; lng: number }, pos2: { lat: number; lng: number }) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((pos2.lat - pos1.lat) * Math.PI) / 180
    const dLng = ((pos2.lng - pos1.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pos1.lat * Math.PI) / 180) *
        Math.cos((pos2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Set current location as study spot
  const setAsStudySpot = () => {
    if (location) {
      setStudyLocation(location)
      setIsAtStudySpot(true)
      // Save to localStorage so it persists
      localStorage.setItem("studyLocation", JSON.stringify(location))
    }
  }

  // Load saved study location when component mounts
  useEffect(() => {
    const saved = localStorage.getItem("studyLocation")
    if (saved) {
      setStudyLocation(JSON.parse(saved))
    }
    getCurrentLocation()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">📍 Location Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}

        <div className="space-y-2">
          <Button onClick={getCurrentLocation} className="w-full">
            📡 Get Current Location
          </Button>

          {location && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <strong>Current:</strong> {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </div>
          )}

          {location && !studyLocation && (
            <Button onClick={setAsStudySpot} variant="outline" className="w-full bg-transparent">
              🎯 Set as Study Spot
            </Button>
          )}

          {studyLocation && (
            <div
              className={`p-3 rounded text-center ${
                isAtStudySpot ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {isAtStudySpot ? "✅ You're at your study spot!" : "⚠️ You're away from your study spot"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
