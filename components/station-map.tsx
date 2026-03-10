'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { Station } from '@/app/api/stations/route'
import { Loader2 } from 'lucide-react'

interface StationMapProps {
  stations: Station[]
  selectedStation: Station | null
  onSelectStation: (station: Station | null) => void
  userLocation: { lat: number; lng: number } | null
}

// Dynamically import react-leaflet components so SSR won't break
const MapContainer = dynamic(
  async () => {
    const { MapContainer } = await import('react-leaflet')
    return MapContainer
  },
  { ssr: false }
)
const TileLayer = dynamic(
  async () => {
    const { TileLayer } = await import('react-leaflet')
    return TileLayer
  },
  { ssr: false }
)
const Marker = dynamic(
  async () => {
    const { Marker } = await import('react-leaflet')
    return Marker
  },
  { ssr: false }
)
const Popup = dynamic(
  async () => {
    const { Popup } = await import('react-leaflet')
    return Popup
  },
  { ssr: false }
)
const useMap = dynamic(
  async () => {
    const { useMap } = await import('react-leaflet')
    return useMap
  },
  { ssr: false }
)

// Helper component to pan map to selected station
function MapPanTo({ position }: { position: { lat: number; lng: number } }) {
  const map: any = useMap()
  useEffect(() => {
    if (position && map) {
      map.setView([position.lat, position.lng], 16, { animate: true })
    }
  }, [position, map])
  return null
}

// Custom marker colors
function getMarkerColor(station: Station) {
  if (!station.isOpen) return '#9ca3af'
  if (station.bikesAvailable === 0) return '#ef4444'
  if (station.bikesAvailable <= 2) return '#f59e0b'
  return '#10b981'
}

export default function StationMap({
  stations,
  selectedStation,
  onSelectStation,
  userLocation,
}: StationMapProps) {
  // Load Leaflet dynamically to avoid SSR errors
  const L = typeof window !== 'undefined' ? require('leaflet') : null

  const center = userLocation || { lat: 47.2184, lng: -1.5536 }

  // Custom icon generator
  const createIcon = (station: Station) =>
    L?.divIcon({
      html: `<div style="
        background: ${getMarkerColor(station)};
        color: white;
        padding: 4px 8px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transform: ${selectedStation?.id === station.id ? 'scale(1.2)' : 'scale(1)'};
        transition: transform 0.2s;
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
      ">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="5" cy="18" r="3"/>
          <circle cx="19" cy="18" r="3"/>
          <path d="M5 18h14M12 18V9l-4-5h4l4 5"/>
        </svg>
        ${station.bikesAvailable}
      </div>`,
      className: '',
      iconSize: [40, 40],
    })

  return (
    <div className="relative w-full h-full">
      {L ? (
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={14}
          style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
          scrollWheelZoom={true}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {stations.map((station) => (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={createIcon(station)}
              eventHandlers={{ click: () => onSelectStation(station) }}
            >
              <Popup>
                {station.name} — Vélos: {station.bikesAvailable}
              </Popup>
            </Marker>
          ))}

          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={L.divIcon({
                html: `<div style="
                  width: 20px;
                  height: 20px;
                  background: #3b82f6;
                  border: 3px solid white;
                  border-radius: 50%;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                "></div>`,
                className: '',
                iconSize: [20, 20],
              })}
            >
              <Popup>Your location</Popup>
            </Marker>
          )}

          {selectedStation && <MapPanTo position={{ lat: selectedStation.latitude, lng: selectedStation.longitude }} />}
        </MapContainer>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  )
}