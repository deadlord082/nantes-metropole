import useSWR from 'swr'
import type { Station } from '@/app/api/stations/route'

const fetcher = async (url: string): Promise<Station[]> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export function useStations() {
  const { data, error, isLoading, mutate } = useSWR<Station[]>(
    '/api/stations',
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
    }
  )

  return {
    stations: data || [],
    isLoading,
    isError: error,
    refresh: () => mutate(),
  }
}
