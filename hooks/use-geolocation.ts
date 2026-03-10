'use client'

import { useState, useCallback } from 'react'

interface Location {
  lat: number
  lng: number
}

export function useGeolocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée')
      return
    }

    setIsLocating(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setIsLocating(false)
      },
      (err) => {
        setError(err.message)
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  }, [])

  return {
    location,
    isLocating,
    error,
    requestLocation,
  }
}
