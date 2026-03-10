import { NextResponse } from 'next/server'

export interface Station {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  bikesAvailable: number
  docksAvailable: number
  totalDocks: number
  isOpen: boolean
  district: string
}

interface ApiRecord {
  number: number
  name: string
  address: string
  position: {
    lat: number
    lon: number
  }
  bike_stands: number
  available_bike_stands: number
  available_bikes: number
  status: string
  contract_name: string
}

export async function GET() {
  try {
    const response = await fetch(
      'https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_stations-velos-libre-service-nantes-metropole-disponibilites/records?limit=100',
      { next: { revalidate: 60 } }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch stations')
    }

    const data = await response.json()

    const stations: Station[] = data.results.map((record: ApiRecord) => {
      const name = record.name || ''
      let district = 'Nantes'
      
      if (name.includes('-')) {
        const parts = name.split('-')
        district = parts[0].trim()
      }

      return {
        id: String(record.number),
        name: record.name,
        address: record.address,
        latitude: record.position?.lat || 0,
        longitude: record.position?.lon || 0,
        bikesAvailable: record.available_bikes || 0,
        docksAvailable: record.available_bike_stands || 0,
        totalDocks: record.bike_stands || 0,
        isOpen: record.status === 'OPEN',
        district: district,
      }
    })

    return NextResponse.json(stations)
  } catch (error) {
    console.error('Error fetching stations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stations' },
      { status: 500 }
    )
  }
}
