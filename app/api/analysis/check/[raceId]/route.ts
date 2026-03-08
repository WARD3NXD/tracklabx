import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ raceId: string }> }
) {
  try {
    const { raceId } = await params
    const ref  = doc(db, 'analysis', raceId)
    const snap = await getDoc(ref)
    return NextResponse.json({ cached: snap.exists() })
  } catch (err) {
    console.error('Error checking analysis cache:', err)
    return NextResponse.json({ cached: false }, { status: 500 })
  }
}
