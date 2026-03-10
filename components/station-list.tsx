'use client'

import { StationCard } from './station-card'
import { Spinner } from '@/components/ui/spinner'
import type { Station } from '@/app/api/stations/route'

interface StationListProps {
  stations: Station[]
  favorites: string[]
  onToggleFavorite: (id: string) => void
  onSelectStation: (station: Station) => void
  userLocation: { lat: number; lng: number } | null
  isLoading: boolean
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function StationList({
  stations,
  favorites,
  onToggleFavorite,
  onSelectStation,
  userLocation,
  isLoading,
}: StationListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  if (stations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucune station trouvée</p>
        <p className="text-sm text-muted-foreground mt-1">
          Essayez de modifier vos filtres
        </p>
      </div>
    )
  }

  const sortedStations = [...stations].sort((a, b) => {
    if (userLocation) {
      const distA = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        a.latitude,
        a.longitude
      )
      const distB = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        b.latitude,
        b.longitude
      )
      return distA - distB
    }
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {stations.length} station{stations.length > 1 ? 's' : ''} trouvée{stations.length > 1 ? 's' : ''}
      </p>
      {sortedStations.map((station) => {
        const distance = userLocation
          ? calculateDistance(
              userLocation.lat,
              userLocation.lng,
              station.latitude,
              station.longitude
            )
          : undefined

        return (
          <div
            key={station.id}
            onClick={() => onSelectStation(station)}
            className="cursor-pointer"
          >
            <StationCard
              station={station}
              isFavorite={favorites.includes(station.id)}
              onToggleFavorite={onToggleFavorite}
              distance={distance}
            />
          </div>
        )
      })}
    </div>
  )
}
