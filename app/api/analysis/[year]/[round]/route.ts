import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export async function GET(
  req: Request,
  { params }: { params: { year: string; round: string } }
) {
  const { year, round } = params
  const cacheKey = `${year}_${round}`

  // Check Firestore cache
  const ref = doc(db, 'analysis', cacheKey)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    return NextResponse.json(snap.data())
  }

  // Call Render FastAPI
  const fastapiUrl = process.env.FASTAPI_URL
  if (!fastapiUrl) return NextResponse.json({ error: 'FASTAPI_URL not set' }, { status: 500 })

  const res = await fetch(`${fastapiUrl}/analysis/${year}/${round}`, {
    signal: AbortSignal.timeout(120000), // 2 min timeout for cold start
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Analysis failed' }, { status: res.status })
  }

  const data = await res.json()

  // Cache permanently in Firestore
  await setDoc(ref, { ...data, cachedAt: new Date().toISOString() })

  return NextResponse.json(data)
}
