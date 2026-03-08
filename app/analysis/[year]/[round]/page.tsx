import { notFound } from 'next/navigation'
import AnalysisPageClient from './AnalysisPageClient'

interface Props {
  params: Promise<{ year: string; round: string }>
}

async function getAnalysisData(year: string, round: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/analysis/${year}/${round}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default async function AnalysisPage({ params }: Props) {
  const { year, round } = await params
  const data = await getAnalysisData(year, round)
  if (!data) notFound()
  return <AnalysisPageClient data={data} />
}
