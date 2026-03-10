'use client'

import { useEffect } from 'react'
import type { Station } from '@/app/api/stations/route'

interface StationMapProps {
  stations: Station[]
  selectedStation: Station | null
  onSelectStation: (station: Station | null) => void
  userLocation: { lat: number; lng: number } | null
}

export default function StationMap(props: StationMapProps) {
  // All react-leaflet imports must happen here inside dynamic import
  const { MapContainer, TileLayer, Marker, Popup, useMap } = require('react-leaflet')
  const L = require('leaflet')

  const { stations, selectedStation, onSelectStation, userLocation } = props

  // You can put the rest of your StationMap implementation here
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={userLocation ? [userLocation.lat, userLocation.lng] : [47.2184, -1.5536]}
        zoom={14}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {stations.map((station) => (
          <Marker key={station.id} position={[station.latitude, station.longitude]}>
            <Popup>
              {station.name} — Bikes: {station.bikesAvailable}
            </Popup>
          </Marker>
        ))}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Your location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}