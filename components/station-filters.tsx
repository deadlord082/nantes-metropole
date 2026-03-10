'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface Filters {
  search: string
  hasBikes: boolean
  hasDocks: boolean
  isOpen: boolean
  showFavorites: boolean
  districts: string[]
}

interface StationFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  districts: string[]
  activeFiltersCount: number
}

export function StationFilters({
  filters,
  onFiltersChange,
  districts,
  activeFiltersCount,
}: StationFiltersProps) {
  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleDistrict = (district: string) => {
    const newDistricts = filters.districts.includes(district)
      ? filters.districts.filter((d) => d !== district)
      : [...filters.districts, district]
    updateFilter('districts', newDistricts)
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      hasBikes: false,
      hasDocks: false,
      isOpen: false,
      showFavorites: false,
      districts: [],
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une station..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
            <SheetHeader className="pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle>Filtres</SheetTitle>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Tout effacer
                  </Button>
                )}
              </div>
            </SheetHeader>
            <ScrollArea className="h-[calc(85vh-100px)]">
              <div className="space-y-6 pr-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Disponibilité</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="hasBikes"
                        checked={filters.hasBikes}
                        onCheckedChange={(checked) => updateFilter('hasBikes', checked === true)}
                      />
                      <Label htmlFor="hasBikes" className="text-sm font-normal cursor-pointer">
                        Vélos disponibles
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="hasDocks"
                        checked={filters.hasDocks}
                        onCheckedChange={(checked) => updateFilter('hasDocks', checked === true)}
                      />
                      <Label htmlFor="hasDocks" className="text-sm font-normal cursor-pointer">
                        Places libres
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="isOpen"
                        checked={filters.isOpen}
                        onCheckedChange={(checked) => updateFilter('isOpen', checked === true)}
                      />
                      <Label htmlFor="isOpen" className="text-sm font-normal cursor-pointer">
                        Stations ouvertes uniquement
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Favoris</h4>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="showFavorites"
                      checked={filters.showFavorites}
                      onCheckedChange={(checked) => updateFilter('showFavorites', checked === true)}
                    />
                    <Label htmlFor="showFavorites" className="text-sm font-normal cursor-pointer">
                      Afficher uniquement les favoris
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Quartiers</h4>
                  <div className="flex flex-wrap gap-2">
                    {districts.map((district) => (
                      <Badge
                        key={district}
                        variant={filters.districts.includes(district) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleDistrict(district)}
                      >
                        {district}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.hasBikes && (
            <Badge variant="secondary" className="gap-1">
              Vélos dispos
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('hasBikes', false)}
              />
            </Badge>
          )}
          {filters.hasDocks && (
            <Badge variant="secondary" className="gap-1">
              Places libres
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('hasDocks', false)}
              />
            </Badge>
          )}
          {filters.isOpen && (
            <Badge variant="secondary" className="gap-1">
              Ouvertes
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('isOpen', false)}
              />
            </Badge>
          )}
          {filters.showFavorites && (
            <Badge variant="secondary" className="gap-1">
              Favoris
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('showFavorites', false)}
              />
            </Badge>
          )}
          {filters.districts.map((district) => (
            <Badge key={district} variant="secondary" className="gap-1">
              {district}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleDistrict(district)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
