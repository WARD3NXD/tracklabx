'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { tracks, continents } from '@/lib/data/tracks';
import { Footer } from '@/components/layout/Footer';
import CircuitIcon from '@/components/ui/CircuitIcon';
import CircuitIconInline from '@/components/ui/CircuitIconInline';



export default function TrackSelectionPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [continent, setContinent] = useState('All');
    const [selectedTrack, setSelectedTrack] = useState('');

    const filtered = tracks.filter(t => {
        const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.country.toLowerCase().includes(search.toLowerCase()) ||
            t.fullName.toLowerCase().includes(search.toLowerCase());
        const matchContinent = continent === 'All' || t.continent === continent;
        return matchSearch && matchContinent;
    });

    const handleNext = () => {
        if (selectedTrack) {
            localStorage.setItem('setup_track', selectedTrack);
            router.push('/setup/team');
        }
    };

    return (
        <div className="min-h-screen bg-carbon text-snow relative overflow-hidden">
            <div className="absolute inset-0 noise-overlay" />
            <div className="absolute top-0 left-0 w-full h-[300px] bg-[radial-gradient(ellipse_at_top,_rgba(237,40,57,0.05)_0%,_transparent_70%)]" />

            <div className="max-w-[1400px] mx-auto px-4 py-24 relative z-10 pt-32">
                {/* Progress Stepper */}
                <div className="flex items-center gap-1 sm:gap-4 mb-12">
                    {['Track', 'Team', 'Conditions', 'Session'].map((step, i) => {
                        const isCurrent = i === 0;
                        const isPast = i < 0; // None past in step 1

                        return (
                            <div key={step} className="flex items-center gap-1 sm:gap-4 flex-1">
                                <div className={`flex flex-col gap-1 w-full ${isCurrent ? 'opacity-100' : 'opacity-30'}`}>
                                    <div className={`h-1 w-full ${isCurrent || isPast ? 'bg-red' : 'bg-snow/10'} rounded-none`} />
                                    <span className="text-[10px] font-mono tracking-widest uppercase font-bold">{step}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-5xl sm:text-7xl font-barlow font-black uppercase tracking-tight leading-none mb-2">
                            Select <span className="text-red">Circuit</span>
                        </h1>
                        <p className="text-snow/50 font-jakarta max-w-xl">
                            Choose the proving ground. Setup data varies wildly between high-downforce and power tracks.
                        </p>
                    </motion.div>

                    {/* Filters */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-4">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="px-4 py-3 bg-gunmetal-deep border border-snow/10 text-sm font-jakarta text-snow placeholder-snow/30 focus:outline-none focus:border-red transition-colors min-w-[250px]"
                            placeholder="SEARCH CIRCUITS..."
                        />
                        <div className="flex bg-gunmetal-deep border border-snow/10 overflow-hidden">
                            {continents.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setContinent(c)}
                                    className={`px-4 py-3 text-xs font-mono font-bold tracking-widest uppercase transition-colors ${continent === c ? 'bg-red text-white border-b-2 border-red-hot' : 'text-snow/50 hover:text-snow hover:bg-snow/5 border-b-2 border-transparent'}`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Track Masonry Grid */}
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 mb-20 space-y-4">
                    {filtered.map((track, i) => (
                        <TrackCard
                            key={track.id}
                            track={track}
                            isSelected={selectedTrack === track.id}
                            onClick={() => setSelectedTrack(track.id)}
                            delay={i * 0.02}
                        />
                    ))}
                </div>

                {/* Sticky Action Footer */}
                <div className="fixed bottom-0 left-0 w-full bg-gunmetal-deep/90 backdrop-blur-xl border-t border-snow/10 p-4 z-50">
                    <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                        <div className="text-xs font-mono text-snow/50 uppercase tracking-widest hidden sm:block">
                            {selectedTrack ? `Selected: ${tracks.find(t => t.id === selectedTrack)?.name}` : 'Awaiting Selection'}
                        </div>
                        <button
                            onClick={handleNext}
                            disabled={!selectedTrack}
                            className="w-full sm:w-auto px-10 py-4 bg-red text-white font-barlow font-bold text-lg uppercase tracking-wider hover:bg-red-hot hover:shadow-[0_0_20px_rgba(237,40,57,0.3)] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            Confirm Selection
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="pb-20"><Footer /></div>
        </div>
    );
}

function TrackCard({ track, isSelected, onClick, delay }: { track: { id: string; name: string; countryCode: string; lapRecord: string; country: string }, isSelected: boolean, onClick: () => void, delay: number }) {
    const [isHovered, setIsHovered] = useState(false);

    // Vary heights slightly for masonry effect
    const heights = ['h-[220px]', 'h-[240px]', 'h-[260px]', 'h-[280px]'];
    const heightClass = heights[track.id.length % 4];

    return (
        <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`track-selector-card circuit-card w-full text-left p-6 transition-all duration-300 relative group overflow-hidden break-inside-avoid flex flex-col justify-between ${heightClass} ${isSelected
                ? 'bg-gunmetal-deep border-2 border-red shadow-[0_0_30px_rgba(237,40,57,0.15)]'
                : 'bg-gunmetal-deep border border-snow/5 hover:border-red hover:shadow-[0_0_20px_rgba(237,40,57,0.1)]'
                }`}
        >
            {/* Track Layout SVG */}
            <div className={`absolute -right-4 -bottom-4 w-[160px] h-[140px] pointer-events-none transition-all duration-700 ease-out ${isHovered || isSelected ? 'opacity-[0.35] scale-110' : 'opacity-[0.2] scale-100'}`}>
                <CircuitIconInline
                    circuitId={track.id}
                    className="w-full h-full"
                    animate={true}
                    loop={false}
                    color={isSelected ? 'var(--red)' : 'var(--snow)'}
                    opacity={1}
                />
            </div>

            <div className="relative z-10 flex items-start justify-between w-full">
                <div className="flex items-center gap-2">
                    <CircuitIcon circuitId={track.id} size="sm" variant="white" />
                    <span className={`text-[10px] font-mono uppercase tracking-widest ${isSelected ? 'text-red font-bold' : 'text-snow/40'}`}>
                        {track.country}
                    </span>
                </div>
                {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-red flex items-center justify-center text-white">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                )}
            </div>

            <div className="relative z-10 mt-auto">
                <h3 className={`font-barlow font-bold text-3xl uppercase leading-tight mb-1 transition-colors ${isSelected ? 'text-red' : 'group-hover:text-red'}`}>{track.name}</h3>
                <p className="text-xs text-snow/50 font-jakarta mb-4">{track.country}</p>
                <div className="flex items-center justify-between border-t border-snow/10 pt-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-snow/30">Track Record</span>
                    <div className="font-mono text-sm font-bold text-snow">{track.lapRecord}</div>
                </div>
            </div>
        </motion.button>
    );
}
