'use client'

import { Heart, Bike, ParkingSquare, MapPin, Navigation } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Station } from '@/app/api/stations/route'

interface StationCardProps {
  station: Station
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  distance?: number
}

export function StationCard({ station, isFavorite, onToggleFavorite, distance }: StationCardProps) {
  const getBikeStatus = () => {
    if (!station.isOpen) return 'closed'
    if (station.bikesAvailable === 0) return 'empty'
    if (station.bikesAvailable <= 2) return 'low'
    return 'available'
  }

  const getDockStatus = () => {
    if (!station.isOpen) return 'closed'
    if (station.docksAvailable === 0) return 'full'
    if (station.docksAvailable <= 2) return 'low'
    return 'available'
  }

  const bikeStatus = getBikeStatus()
  const dockStatus = getDockStatus()

  const openInMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`
    window.open(url, '_blank')
  }

  return (
    <Card className={`transition-all hover:shadow-md ${!station.isOpen ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate text-balance">{station.name}</h3>
              {!station.isOpen && (
                <Badge variant="secondary" className="shrink-0 text-xs">
                  Fermée
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{station.address}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => onToggleFavorite(station.id)}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground'
              }`}
            />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div
            className={`flex items-center gap-2 p-2 rounded-lg ${
              bikeStatus === 'available'
                ? 'bg-success/10 text-success'
                : bikeStatus === 'low'
                ? 'bg-warning/10 text-warning-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <Bike className="h-5 w-5" />
            <div>
              <div className="font-bold text-lg leading-none">{station.bikesAvailable}</div>
              <div className="text-xs">vélos</div>
            </div>
          </div>
          <div
            className={`flex items-center gap-2 p-2 rounded-lg ${
              dockStatus === 'available'
                ? 'bg-primary/10 text-primary'
                : dockStatus === 'low'
                ? 'bg-warning/10 text-warning-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <ParkingSquare className="h-5 w-5" />
            <div>
              <div className="font-bold text-lg leading-none">{station.docksAvailable}</div>
              <div className="text-xs">places</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {distance !== undefined && (
            <span className="text-xs text-muted-foreground">
              {distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1"
            onClick={openInMaps}
          >
            <Navigation className="h-3 w-3" />
            Itinéraire
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
