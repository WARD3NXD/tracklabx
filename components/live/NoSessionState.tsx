'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import RaceCard from '@/components/calendar/RaceCard'
import { fetchSeasonRaces } from '@/lib/jolpica'
import { getCircuitSVG } from '@/lib/circuitMaps'
import { formatSessionTime } from '@/lib/utils'

interface NoSessionStateProps {
  justEnded: boolean
  lastRaceId: string | null
  lastRaceRound: number | null
  lastSession: any | null
}

export default function NoSessionState({
  justEnded,
  lastRaceId,
  lastRaceRound,
  lastSession,
}: NoSessionStateProps) {
  const [races, setRaces] = useState<any[]>([])
  const [analysisReady, setReady] = useState(false)
  const [loading, setLoading] = useState(true)

  const currentYear = new Date().getFullYear()

  useEffect(() => {
    async function load() {
      try {
        const seasonRaces = await fetchSeasonRaces(currentYear)
        
        // Filter only completed races (based on race date)
        const completed = seasonRaces.filter((r: any) => {
          const raceDate = new Date(r.date)
          return raceDate < new Date()
        })

        // Simple mapping to fit RaceCard expectations
        const mapped = completed.map((r: any) => ({
          id: r.raceName.toLowerCase().replace(/ /g, '-'),
          round: parseInt(r.round),
          circuitName: r.Circuit.circuitName,
          country: r.Circuit.Location.country,
          countryCode: r.Circuit.Location.country === 'USA' ? 'US' : 'Generic', // Simplification
          startDate: r.date,
          endDate: r.date,
          sessions: { race: `${r.date}T${r.time || '00:00:00Z'}` },
          results: { 
            winner: r.Results && r.Results[0] ? { 
                driver: `${r.Results[0].Driver.givenName} ${r.Results[0].Driver.familyName}`,
                team: r.Results[0].Constructor.name
            } : null 
          },
          isSprint: false // Simplification for now
        }))

        setRaces(mapped.reverse()) // most recent first

        // Check if analysis is cached for last race
        if (lastRaceId) {
          const check = await fetch(`/api/analysis/check/${lastRaceId}`)
          const { cached } = await check.json()
          setReady(cached)
        }
      } catch (err) {
        console.error('Error loading races:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [lastRaceId, currentYear])

  const featuredRace = races[0] ?? null

  return (
    <div className="no-session-page">
      {/* ── Hero: No Live Session Banner ── */}
      <motion.section
        className="no-session-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {featuredRace && (
          <div className="no-session-bg">
            <img
              src={getCircuitSVG(featuredRace.id)}
              alt=""
              className="circuit-watermark"
            />
          </div>
        )}

        <div className="no-session-hero-content relative z-10">
          <div className="no-session-status">
            <span className="status-dot status-dot--inactive" />
            <span className="status-label uppercase tracking-widest text-[#FFFAF0]/40">
              {justEnded ? 'SESSION ENDED' : 'NO LIVE SESSION'}
            </span>
          </div>

          <h1 className="no-session-title">
            {justEnded ? 'RACE FINISHED' : 'TRACK IS QUIET'}
          </h1>
          <p className="no-session-subtitle">
            {justEnded
              ? `The ${lastSession?.session_name || 'session'} has ended.`
              : 'No session is currently running.'}
          </p>
        </div>
      </motion.section>

      {/* ── Featured Race Analysis Banner ── */}
      {featuredRace && (
        <motion.section
          className="featured-analysis-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="section-label">
            {justEnded ? 'JUST FINISHED' : 'MOST RECENT RACE'}
          </span>

          <div className="featured-analysis-banner">
            <div className="featured-analysis-info">
              <div className="featured-race-meta mb-2">
                <span className="featured-round font-barlow font-bold text-red tracking-widest uppercase">
                  ROUND {String(featuredRace.round).padStart(2, '0')}
                </span>
              </div>

              <h2 className="featured-race-name">
                {featuredRace.circuitName.toUpperCase()}
                <br />
                <span className="featured-gp text-red">GRAND PRIX</span>
              </h2>

              <p className="featured-circuit mt-2">
                {featuredRace.country}
              </p>

              {featuredRace.results?.winner && (
                <div className="featured-winner mt-6">
                  <span className="featured-winner-label text-red">RACE WINNER</span>
                  <span className="featured-winner-name ml-3 font-bold">{featuredRace.results.winner.driver}</span>
                  <span className="featured-winner-team ml-2 text-snow/40">{featuredRace.results.winner.team}</span>
                </div>
              )}
            </div>

            <div className="featured-analysis-visual">
              <img
                src={getCircuitSVG(featuredRace.id)}
                alt={featuredRace.circuitName}
                className="featured-circuit-svg"
              />
            </div>

            <div className="featured-analysis-cta mt-8">
              {analysisReady ? (
                <Link
                  href={`/analysis/${currentYear}-R${featuredRace.round}`}
                  className="btn-analysis-primary"
                >
                  <span className="btn-icon">📊</span>
                  FULL RACE ANALYSIS
                  <span className="btn-arrow ml-2">→</span>
                </Link>
              ) : justEnded ? (
                <div className="btn-analysis-processing">
                  <div className="flex items-center gap-3">
                    <span className="processing-spinner" />
                    <span className="uppercase font-bold tracking-widest">ANALYSIS PROCESSING...</span>
                  </div>
                  <span className="processing-hint block mt-1 ml-8">
                    Data arriving via FastF1. Check back in ~30 mins.
                  </span>
                </div>
              ) : (
                <Link
                  href={`/analysis/${currentYear}-R${featuredRace.round}`}
                  className="btn-analysis-primary"
                >
                  FULL RACE ANALYSIS →
                </Link>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* ── Race Selector Grid ── */}
      <motion.section
        className="race-selector-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="race-selector-header mb-8">
          <span className="section-label">
            {currentYear} SEASON — SELECT RACE ANALYSIS
          </span>
          <p className="race-selector-hint">
            Choose any completed race to view post-race analysis
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
             {[...Array(4)].map((_, i) => (
               <div key={i} className="h-[250px] bg-gunmetal-deep animate-pulse border border-snow/5 rounded-none" />
             ))}
          </div>
        ) : races.length === 0 ? (
          <div className="race-selector-empty">
            <p>No completed races yet this season.</p>
          </div>
        ) : (
          <div className="race-selector-grid">
            {races.map((race: any, i: number) => (
              <motion.div
                key={race.round}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <RaceCard
                  race={race}
                  href={`/analysis/${currentYear}-R${race.round}`}
                  ctaLabel="View Analysis →"
                  featured={i === 0}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  )
}
