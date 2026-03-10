'use client'

import { useState, useMemo, useEffect } from 'react'
import { List, Map as MapIcon } from 'lucide-react'
import { Header } from '@/components/header'
import { StationFilters, type Filters } from '@/components/station-filters'
import { StationList } from '@/components/station-list'
import { Button } from '@/components/ui/button'
import { useStations } from '@/hooks/use-stations'
import { useFavorites } from '@/hooks/use-favorites'
import { useGeolocation } from '@/hooks/use-geolocation'
import type { Station } from '@/app/api/stations/route'
import dynamic from 'next/dynamic'

export default function Home() {
  const { stations, isLoading, refresh } = useStations()
  const { favorites, toggleFavorite } = useFavorites()
  const { location, isLocating, requestLocation } = useGeolocation()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [view, setView] = useState<'list' | 'map'>('list')
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const StationMap = dynamic(() => import('@/components/station-map'), { ssr: false })
  const [filters, setFilters] = useState<Filters>({
    search: '',
    hasBikes: false,
    hasDocks: false,
    isOpen: false,
    showFavorites: false,
    districts: [],
  })

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refresh()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const districts = useMemo(() => {
    const uniqueDistricts = new Set(stations.map((s) => s.district))
    return Array.from(uniqueDistricts).sort()
  }, [stations])

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      if (filters.search) {
        const search = filters.search.toLowerCase()
        if (
          !station.name.toLowerCase().includes(search) &&
          !station.address.toLowerCase().includes(search)
        ) {
          return false
        }
      }

      if (filters.hasBikes && station.bikesAvailable === 0) {
        return false
      }

      if (filters.hasDocks && station.docksAvailable === 0) {
        return false
      }

      if (filters.isOpen && !station.isOpen) {
        return false
      }

      if (filters.showFavorites && !favorites.includes(station.id)) {
        return false
      }

      if (
        filters.districts.length > 0 &&
        !filters.districts.includes(station.district)
      ) {
        return false
      }

      return true
    })
  }, [stations, filters, favorites])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.hasBikes) count++
    if (filters.hasDocks) count++
    if (filters.isOpen) count++
    if (filters.showFavorites) count++
    count += filters.districts.length
    return count
  }, [filters])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        onRefresh={handleRefresh}
        onLocate={requestLocation}
        isRefreshing={isRefreshing}
        isLocating={isLocating}
      />

      <main className="flex-1 container max-w-7xl mx-auto px-4 py-4">
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 h-full">
          <div className="space-y-4">
            <StationFilters
              filters={filters}
              onFiltersChange={setFilters}
              districts={districts}
              activeFiltersCount={activeFiltersCount}
            />

            <div className="lg:hidden flex gap-2">
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                className="flex-1 gap-2"
                onClick={() => setView('list')}
              >
                <List className="h-4 w-4" />
                Liste
              </Button>
              <Button
                variant={view === 'map' ? 'default' : 'outline'}
                className="flex-1 gap-2"
                onClick={() => setView('map')}
              >
                <MapIcon className="h-4 w-4" />
                Carte
              </Button>
            </div>

            <div className={`${view === 'list' ? 'block' : 'hidden'} lg:block`}>
              <StationList
                stations={filteredStations}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onSelectStation={(station) => {
                  setSelectedStation(station)
                  setView('map')
                }}
                userLocation={location}
                isLoading={isLoading}
              />
            </div>
          </div>

          <div
            className={`${
              view === 'map' ? 'fixed inset-0 top-[60px] z-40 p-4 bg-background lg:static lg:p-0' : 'hidden'
            } lg:block lg:sticky lg:top-[76px] lg:h-[calc(100vh-92px)]`}
          >
            {view === 'map' && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-6 left-6 z-50 lg:hidden shadow-lg"
                onClick={() => setView('list')}
              >
                <List className="h-4 w-4 mr-2" />
                Retour à la liste
              </Button>
            )}
            <StationMap
              stations={filteredStations}
              selectedStation={selectedStation}
              onSelectStation={setSelectedStation}
              userLocation={location}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
