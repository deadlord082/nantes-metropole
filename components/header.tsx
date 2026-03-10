'use client'

import { Bike, MapPin, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onRefresh: () => void
  onLocate: () => void
  isRefreshing: boolean
  isLocating: boolean
}

export function Header({ onRefresh, onLocate, isRefreshing, isLocating }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Bike className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground leading-tight">Bicloo</h1>
              <p className="text-xs text-muted-foreground">Nantes Métropole</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onLocate}
              disabled={isLocating}
              aria-label="Me localiser"
            >
              <MapPin className={`h-5 w-5 ${isLocating ? 'animate-pulse' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Actualiser"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
