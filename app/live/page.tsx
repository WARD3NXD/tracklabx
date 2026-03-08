'use client'

import { useLiveStatus } from '@/hooks/useLiveStatus'
import LiveSession from '@/components/live/LiveSession'
import NoSessionState from '@/components/live/NoSessionState'
import { motion, AnimatePresence } from 'framer-motion'
import './live.css'

export default function LivePage() {
  const status = useLiveStatus()

  if (status.isLoading) {
    return (
      <div className="min-h-screen bg-carbon flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red/20 border-t-red rounded-full animate-spin" />
          <span className="font-barlow font-bold text-snow/40 tracking-widest uppercase text-sm">Detecting Live Status...</span>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {status.state === 'live' ? (
        <motion.div
          key="live"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <LiveSession session={status.session} />
        </motion.div>
      ) : (
        <motion.div
          key="no-session"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <NoSessionState
            justEnded={status.state === 'just-ended'}
            lastRaceId={status.lastRaceId}
            lastRaceRound={status.lastRaceRound}
            lastSession={status.session}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
