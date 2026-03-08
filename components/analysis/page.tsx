// app/analysis/[year]/[round]/page.tsx
import { notFound } from 'next/navigation'
import AnalysisPageClient from './AnalysisPageClient'

interface Props {
  params: { year: string; round: string }
}

async function getAnalysisData(year: string, round: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/analysis/${year}/${round}`, {
      next: { revalidate: 3600 }, // cache for 1 hour
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default async function AnalysisPage({ params }: Props) {
  const data = await getAnalysisData(params.year, params.round)
  if (!data) notFound()
  return <AnalysisPageClient data={data} />
}

export async function generateMetadata({ params }: Props) {
  const data = await getAnalysisData(params.year, params.round)
  if (!data) return { title: 'Race Analysis — TrackLabX' }
  return {
    title: `${data.raceName} Analysis — TrackLabX`,
    description: `Post-race telemetry analysis for the ${data.year} ${data.raceName}`,
  }
}
