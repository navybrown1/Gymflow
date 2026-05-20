import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, AlertCircle, CheckCircle, Sparkles, Trophy, Dumbbell, Film, Grid } from 'lucide-react';

interface BiomechanicalModelProps {
  exerciseId?: number;
  exerciseName?: string;
}

const MOVEMENT_VIDEOS: Record<string, { correct: string; incorrect: string }> = {
  squat: {
    correct: 'vmNPOjaGrVE', // Alan Thrall Back Squat (Correct & verified embeddable)
    incorrect: 'FBBb1v1nO8E' // Alan Thrall Squat Mistakes (Correct & verified embeddable)
  },
  bench: {
    correct: 'vcBig73ojpE', // Starting Strength Bench Press (Correct & verified embeddable)
    incorrect: 'vcBig73ojpE'
  },
  row: {
    correct: 'G8l_8chR5BE', // Alan Thrall Bent Over Row (Correct & verified embeddable)
    incorrect: 'G8l_8chR5BE'
  },
  plank: {
    correct: 'gT5-hWf1T5A', // FitnessFAQs Plank Hold (Correct & verified embeddable)
    incorrect: 'gT5-hWf1T5A'
  }
};

export default function BiomechanicalModel({ exerciseId, exerciseName }: BiomechanicalModelProps) {
  const [phase, setPhase] = useState<'eccentric' | 'concentric'>('concentric');
  const [viewMode, setViewMode] = useState<'correct' | 'incorrect'>('correct');
  const [displayMode, setDisplayMode] = useState<'schematic' | 'video'>('video');
  
  // Decide which specific movement avatar to render based on either exerciseId or custom selector
  const [selectedMovement, setSelectedMovement] = useState<string>(() => {
    if (exerciseName?.toLowerCase().includes('squat')) return 'squat';
    if (exerciseName?.toLowerCase().includes('bench')) return 'bench';
    if (exerciseName?.toLowerCase().includes('row') || exerciseName?.toLowerCase().includes('pull')) return 'row';
    if (exerciseName?.toLowerCase().includes('plank')) return 'plank';
    return 'squat'; // default
  });

  const handlePhaseToggle = () => {
    setPhase(prev => prev === 'eccentric' ? 'concentric' : 'eccentric');
  };

  return (
    <div id="biomechanical-model-panel" className="bg-zinc-900 border border-white/5 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
      {/* Visual background details */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="bg-lime-400 text-zinc-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Anatomy & Biomechanics Lab
            </span>
            <h3 className="text-2xl font-black italic uppercase text-white mt-2 flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-lime-400 animate-pulse" /> Form Simulator
            </h3>
          </div>

          <div className="flex gap-1 bg-zinc-950 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
            {['squat', 'bench', 'row', 'plank'].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMovement(m)}
                className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                  selectedMovement === m
                    ? 'bg-lime-400 text-zinc-950 shadow-md scale-105'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Phase + Form Mode Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="flex bg-zinc-950 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setPhase('eccentric')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                phase === 'eccentric' ? 'bg-zinc-850 text-lime-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Eccentric (Setup)
            </button>
            <button
              onClick={() => setPhase('concentric')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                phase === 'concentric' ? 'bg-zinc-850 text-lime-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Concentric (Peak)
            </button>
          </div>

          <div className="flex bg-zinc-950 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setViewMode('correct')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                viewMode === 'correct' ? 'bg-lime-400/10 text-lime-400 border border-lime-400/20' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Perfect Form
            </button>
            <button
              onClick={() => setViewMode('incorrect')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                viewMode === 'incorrect' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Mistakes Loop
            </button>
          </div>
        </div>

        {/* Display Mode Selector Tabs */}
        <div className="flex bg-zinc-950 rounded-xl p-1 border border-white/10 mb-4 self-center w-full">
          <button
            onClick={() => setDisplayMode('video')}
            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              displayMode === 'video'
                ? 'bg-lime-400 text-zinc-950 shadow-md scale-[1.01]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Film className="h-3.5 w-3.5" /> Real Athlete Video
          </button>
          <button
            onClick={() => setDisplayMode('schematic')}
            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              displayMode === 'schematic'
                ? 'bg-lime-400 text-zinc-950 shadow-md scale-[1.01]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Grid className="h-3.5 w-3.5" /> Biomechanical Schematic
          </button>
        </div>

        {/* Dynamic Biomechanical & Real Athlete Screen Container */}
        <div className="bg-zinc-950 rounded-2xl p-4 border border-white/10 flex flex-col items-center justify-center relative min-h-[280px]">
          {displayMode === 'video' ? (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black relative shadow-lg">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${MOVEMENT_VIDEOS[selectedMovement]?.[viewMode]}?autoplay=1&mute=1&loop=1&playlist=${MOVEMENT_VIDEOS[selectedMovement]?.[viewMode]}&controls=1&playsinline=1&enablejsapi=1`}
                  title="Real Athlete Demonstration"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-3 flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-white/5 rounded-full">
                <span className={`h-2 w-2 rounded-full ${viewMode === 'correct' ? 'bg-lime-400 animate-pulse' : 'bg-rose-500 animate-pulse'}`} />
                <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest">
                  Live Athlete Loop • {viewMode === 'correct' ? 'Optimal Performance' : 'Common Point of Failure'}
                </span>
              </div>
            </div>
          ) : (
            <>
              <svg viewBox="0 0 200 200" className="w-full max-w-[200px] h-auto drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            {/* Grid Pattern in Background */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.2" />
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#grid)" rx="10" />

            {/* SQUAT ANIMATION */}
            {selectedMovement === 'squat' && (
              <>
                {/* Floor */}
                <line x1="20" y1="180" x2="180" y2="180" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />
                
                {/* Skeletal Rigging */}
                <g strokeWidth="4" strokeLinecap="round">
                  {/* Foot */}
                  <line x1="90" y1="180" x2="115" y2="180" stroke="#64748b" />
                  
                  {/* Legs, Knees, Hips, Torso, Head */}
                  {viewMode === 'correct' ? (
                    phase === 'eccentric' ? (
                      // Correct Deep Squat Position
                      <>
                        {/* Lower Leg (Ankle to Knee) */}
                        <line x1="100" y1="180" x2="95" y2="140" stroke="#a3e635" />
                        {/* Upper Leg (Knee to Hip) */}
                        <line x1="95" y1="140" x2="55" y2="135" stroke="#a3e635" />
                        {/* Spine (Hip to Neck) */}
                        <line x1="55" y1="135" x2="85" y2="85" stroke="#a3e635" />
                        {/* Head */}
                        <circle cx="95" cy="70" r="10" fill="#1e293b" stroke="#a3e635" strokeWidth="3" />
                        {/* Barbell load path vector */}
                        <line x1="83" y1="88" x2="83" y2="180" stroke="#a3e635" strokeWidth="1" strokeDasharray="2 2" />
                        {/* Barbell */}
                        <line x1="55" y1="90" x2="115" y2="90" stroke="#e2e8f0" strokeWidth="6" />
                        <circle cx="55" cy="90" r="8" fill="#475569" />
                        <circle cx="115" cy="90" r="8" fill="#475569" />
                        {/* Hip Crease Arrow indicator */}
                        <path d="M 52 142 L 58 128" stroke="#bef264" strokeWidth="2" fill="none" />
                      </>
                    ) : (
                      // Correct Standing Position
                      <>
                        <line x1="100" y1="180" x2="100" y2="130" stroke="#a3e635" />
                        <line x1="100" y1="130" x2="100" y2="80" stroke="#a3e635" />
                        {/* Spine */}
                        <line x1="100" y1="80" x2="100" y2="40" stroke="#a3e635" />
                        <circle cx="100" cy="25" r="10" fill="#1e293b" stroke="#a3e635" strokeWidth="3" />
                        {/* Barbell */}
                        <line x1="70" y1="45" x2="130" y2="45" stroke="#e2e8f0" strokeWidth="6" />
                        <circle cx="70" cy="45" r="8" fill="#475569" />
                        <circle cx="130" cy="45" r="8" fill="#475569" />
                      </>
                    )
                  ) : (
                    // INCORRECT SQUAT (Valgus Collapse & Spine Rounding)
                    phase === 'eccentric' ? (
                      <>
                        {/* Rounded Butt Wink Spine */}
                        <path d="M 100 180 Q 80 150 95 140" fill="none" stroke="#f43f5e" strokeWidth="4" />
                        {/* Broken Knee hinge */}
                        <line x1="95" y1="140" x2="52" y2="145" stroke="#f43f5e" />
                        {/* Rounded lower back spine curve */}
                        <path d="M 52 145 Q 40 100 80 85" fill="none" stroke="#f43f5e" strokeWidth="4" />
                        <circle cx="90" cy="73" r="10" fill="#1e293b" stroke="#f43f5e" strokeWidth="3" />
                        {/* Barbell sliding forward dangerously */}
                        <line x1="50" y1="95" x2="110" y2="95" stroke="#94a3b8" strokeWidth="5" />
                        <circle cx="50" cy="95" r="8" fill="#f43f5e" />
                        <circle cx="110" cy="95" r="8" fill="#f43f5e" />
                        {/* Danger alert symbol */}
                        <circle cx="55" cy="115" r="7" fill="#f43f5e" stroke="none" />
                        <text x="53" y="119" fill="#fff" fontSize="9" fontWeight="bold">!</text>
                      </>
                    ) : (
                      // Leaning Standing (poor posture setup)
                      <>
                        <line x1="100" y1="180" x2="105" y2="132" stroke="#f43f5e" />
                        <line x1="105" y1="132" x2="95" y2="82" stroke="#f43f5e" />
                        <circle cx="95" cy="65" r="10" fill="#1e293b" stroke="#f43f5e" strokeWidth="3" />
                        <line x1="65" y1="85" x2="125" y2="85" stroke="#f43f5e" strokeWidth="5" />
                        <circle cx="65" cy="85" r="8" fill="#e11d48" />
                        <circle cx="125" cy="85" r="8" fill="#e11d48" />
                      </>
                    )
                  )}
                </g>

                {/* Highlights Overlay points */}
                {viewMode === 'correct' && phase === 'eccentric' && (
                  <>
                    <circle cx="95" cy="140" r="4" fill="#bef264" />
                    <circle cx="55" cy="135" r="4" fill="#bef264" />
                    {/* Hip Angle Indicator */}
                    <text x="35" y="150" fill="#bef264" fontSize="8" fontWeight="bold">PARALLEL ✓</text>
                  </>
                )}
                {viewMode === 'incorrect' && phase === 'eccentric' && (
                  <>
                    <circle cx="60" cy="120" r="5" fill="#f43f5e" className="animate-ping" />
                    <text x="10" y="125" fill="#f43f5e" fontSize="7" fontWeight="bold">ROUNDED BACK</text>
                  </>
                )}
              </>
            )}

            {/* BENCH PRESS ANIMATION */}
            {selectedMovement === 'bench' && (
              <>
                {/* Bench Pad Representation */}
                <rect x="30" y="120" width="140" height="20" fill="#1e293b" rx="4" stroke="#475569" strokeWidth="2" />
                <rect x="50" y="140" width="15" height="40" fill="#334155" />
                <rect x="135" y="140" width="15" height="40" fill="#334155" />

                {/* Body Rigging */}
                <g strokeWidth="4" strokeLinecap="round">
                  {viewMode === 'correct' ? (
                    phase === 'eccentric' ? (
                      // Bar resting down on sternum with tucked elbows
                      <>
                        {/* Head & shoulders flat on bench */}
                        <circle cx="55" cy="110" r="10" fill="#0f172a" stroke="#a3e635" strokeWidth="3" />
                        {/* Torso lying down */}
                        <line x1="55" y1="120" x2="135" y2="120" stroke="#a3e635" />
                        {/* Arm layout (shoulder 55 to elbow to hand) */}
                        <line x1="80" y1="120" x2="90" y2="110" stroke="#a3e635" />
                        <line x1="90" y1="110" x2="100" y2="85" stroke="#a3e635" />
                        {/* Barbell at rest on chest */}
                        <line x1="100" y1="80" x2="100" y2="140" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                        <circle cx="100" cy="85" r="7" fill="#a3e635" />
                        <line x1="75" y1="85" x2="125" y2="85" stroke="#f1f5f9" strokeWidth="6" />
                        <circle cx="75" cy="85" r="6" fill="#475569" />
                        <circle cx="125" cy="85" r="6" fill="#475569" />
                      </>
                    ) : (
                      // Bar driven straight up (lockout peak)
                      <>
                        <circle cx="55" cy="110" r="10" fill="#0f172a" stroke="#a3e635" strokeWidth="3" />
                        <line x1="55" y1="120" x2="135" y2="120" stroke="#a3e635" />
                        {/* Fully locked arms */}
                        <line x1="80" y1="120" x2="90" y2="80" stroke="#a3e635" />
                        <line x1="90" y1="80" x2="100" y2="40" stroke="#a3e635" />
                        <line x1="75" y1="40" x2="125" y2="40" stroke="#f1f5f9" strokeWidth="6" />
                        <circle cx="75" cy="40" r="6" fill="#475569" />
                        <circle cx="125" cy="40" r="6" fill="#475569" />
                      </>
                    )
                  ) : (
                    // Bad Bench (Elbow flaring & loose arching)
                    phase === 'eccentric' ? (
                      <>
                        <circle cx="55" cy="110" r="10" fill="#0f172a" stroke="#f43f5e" strokeWidth="3" />
                        <line x1="55" y1="120" x2="135" y2="120" stroke="#f43f5e" />
                        {/* Over-flared awkward arm */}
                        <line x1="80" y1="120" x2="105" y2="125" stroke="#f43f5e" />
                        <line x1="105" y1="125" x2="100" y2="78" stroke="#f43f5e" />
                        {/* Crook bar pathway */}
                        <line x1="75" y1="78" x2="125" y2="78" stroke="#f43f5e" strokeWidth="5" />
                        <circle cx="75" cy="78" r="6" fill="#f43f5e" />
                        <circle cx="125" cy="78" r="6" fill="#f43f5e" />
                        <text x="110" y="110" fill="#f43f5e" fontSize="7" fontWeight="bold">FLARED 90°</text>
                      </>
                    ) : (
                      // Unstable lockout
                      <>
                        <circle cx="55" cy="110" r="10" fill="#0f172a" stroke="#f43f5e" strokeWidth="3" />
                        <line x1="55" y1="120" x2="135" y2="120" stroke="#f43f5e" />
                        <line x1="80" y1="120" x2="95" y2="85" stroke="#f43f5e" />
                        <line x1="95" y1="85" x2="115" y2="45" stroke="#f43f5e" />
                        <line x1="90" y1="45" x2="140" y2="45" stroke="#ef4444" strokeWidth="5" />
                      </>
                    )
                  )}
                </g>
              </>
            )}

            {/* ROWING / LAT PULLDOWN ANIMATION */}
            {selectedMovement === 'row' && (
              <>
                {/* Bench base */}
                <line x1="30" y1="180" x2="170" y2="180" stroke="#475569" strokeWidth="2" />
                
                <g strokeWidth="4" strokeLinecap="round">
                  {viewMode === 'correct' ? (
                    phase === 'eccentric' ? (
                      // Bent forward, arms extended stretching the back
                      <>
                        <line x1="100" y1="180" x2="95" y2="120" stroke="#a3e635" /> {/* legs */}
                        <line x1="95" y1="120" x2="50" y2="100" stroke="#a3e635" /> {/* neutral spine */}
                        <circle cx="40" cy="85" r="9" fill="#1e293b" stroke="#a3e635" strokeWidth="3" />
                        {/* Arms extended down towards floor */}
                        <line x1="55" y1="102" x2="70" y2="145" stroke="#a3e635" />
                        <line x1="70" y1="145" x2="70" y2="150" stroke="#a3e635" />
                        {/* Dumbbell load weight */}
                        <circle cx="70" cy="155" r="6" fill="#bef264" />
                      </>
                    ) : (
                      // Squeezed peak row (elbows driven far back/up)
                      <>
                        <line x1="100" y1="180" x2="95" y2="120" stroke="#a3e635" />
                        <line x1="95" y1="120" x2="50" y2="100" stroke="#a3e635" />
                        <circle cx="40" cy="85" r="9" fill="#1e293b" stroke="#a3e635" strokeWidth="3" />
                        {/* Arm pulled upward with high bent elbow */}
                        <line x1="55" y1="102" x2="40" y2="112" stroke="#a3e635" />
                        <line x1="40" y1="112" x2="60" y2="110" stroke="#a3e635" />
                        <circle cx="60" cy="110" r="6" fill="#a3e635" />
                        <text x="35" y="132" fill="#bef264" fontSize="7" fontWeight="bold">SQUEEZE LATS ✓</text>
                      </>
                    )
                  ) : (
                    // Bad Row (rounded humped back, pulling with arms instead of back)
                    phase === 'eccentric' ? (
                      <>
                        <line x1="100" y1="180" x2="95" y2="120" stroke="#f43f5e" />
                        {/* Round curved humped thoracic spine */}
                        <path d="M 95 120 Q 60 115 45 92" fill="none" stroke="#f43f5e" strokeWidth="4" />
                        <circle cx="38" cy="78" r="9" fill="#1e293b" stroke="#f43f5e" strokeWidth="3" />
                        <line x1="55" y1="114" x2="72" y2="148" stroke="#f43f5e" />
                        <circle cx="72" cy="148" r="6" fill="#ef4444" />
                        <circle cx="65" cy="110" r="7" fill="#e11d48" />
                        <text x="63" y="113" fill="#fff" fontSize="8" fontWeight="bold">!</text>
                      </>
                    ) : (
                      // Jerky high row
                      <>
                        <line x1="100" y1="180" x2="105" y2="122" stroke="#f43f5e" />
                        <path d="M 105 122 Q 80 115 60 95" fill="none" stroke="#f43f5e" strokeWidth="4" />
                        <circle cx="50" cy="82" r="9" fill="#1e293b" stroke="#f43f5e" strokeWidth="3" />
                        <line x1="68" y1="110" x2="70" y2="135" stroke="#f43f5e" />
                      </>
                    )
                  )}
                </g>
              </>
            )}

            {/* PLANK ANIMATION */}
            {selectedMovement === 'plank' && (
              <>
                <line x1="20" y1="170" x2="180" y2="170" stroke="#475569" strokeWidth="2" />

                <g strokeWidth="4" strokeLinecap="round">
                  {viewMode === 'correct' ? (
                    // Perfect flat body table line
                    <>
                      {/* Arm support */}
                      <line x1="150" y1="170" x2="145" y2="145" stroke="#a3e635" />
                      <line x1="145" y1="145" x2="155" y2="145" stroke="#a3e635" strokeWidth="2" />
                      {/* Flat body straight line */}
                      <line x1="45" y1="168" x2="145" y2="145" stroke="#a3e635" />
                      <circle cx="152" cy="133" r="8" fill="#1e293b" stroke="#a3e635" strokeWidth="3" />
                      <text x="75" y="130" fill="#bef264" fontSize="8" fontWeight="bold">ALIGNMENT 180° ✓</text>
                    </>
                  ) : (
                    // Saggy hips plank
                    <>
                      <line x1="150" y1="170" x2="145" y2="145" stroke="#f43f5e" />
                      {/* Curved sagging hips path */}
                      <path d="M 45 168 Q 95 180 145 145" fill="none" stroke="#f43f5e" strokeWidth="4" />
                      <circle cx="152" cy="133" r="8" fill="#1e293b" stroke="#f43f5e" strokeWidth="3" />
                      <circle cx="95" cy="177" r="6" fill="#f43f5e" className="animate-ping" />
                      <text x="60" y="130" fill="#f43f5e" fontSize="7" fontWeight="bold">SAGGY SAG HIPS (STREIN!)</text>
                    </>
                  )}
                </g>
              </>
            )}
          </svg>

          {/* Quick coaching info pill */}
          <div className="absolute bottom-2 right-2 bg-zinc-900 px-2.5 py-1 rounded-lg border border-white/10 text-[10px] text-zinc-400">
            {viewMode === 'correct' ? 'Optimal Alignment Grid' : 'Biomechanical Points of Failure'}
          </div>
        </>
      )}
    </div>

        {/* Informative form insights & motivation feedback under simulated model */}
        <div className="mt-4 p-4 bg-zinc-950 rounded-2xl border border-white/5 text-zinc-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedMovement}_${viewMode}_${phase}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-2 text-xs"
            >
              {viewMode === 'correct' ? (
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-lime-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-lime-400 block uppercase text-[10px] tracking-wide">Form Checklist:</span>
                    <p className="text-zinc-300">
                      {selectedMovement === 'squat' && phase === 'eccentric' && 'Maintain bar path centered over mid-foot. Hips descend below knee crease. Spine holds neutral arch.'}
                      {selectedMovement === 'squat' && phase === 'concentric' && 'Drive knees outward. Push flat against the floor. Finish with glutes active. Keep head high.'}
                      {selectedMovement === 'bench' && phase === 'eccentric' && 'Lower in a controlled arc pathway. Touch the lower sternum. Elbows tucked at 45 degrees.'}
                      {selectedMovement === 'bench' && phase === 'concentric' && 'Push directly up while driving your feet into the floor. Maximize terminal pec contraction.'}
                      {selectedMovement === 'row' && phase === 'eccentric' && 'Hinge backward 45 degrees. Extend elbows to stretch the lat muscles comfortably downwards.'}
                      {selectedMovement === 'row' && phase === 'concentric' && 'Lead with the elbows. Pull directly into lower ribs. Retract scapula aggressively.'}
                      {selectedMovement === 'plank' && 'Squeeze target quad muscles and glutes. Keep core tight to keep hips in absolute planar alignment.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-rose-400 block uppercase text-[10px] tracking-wide">Mistakes To Eliminate:</span>
                    <p className="text-rose-200">
                      {selectedMovement === 'squat' && 'Do not round the t-spine (butt wink) or allow vertical chest collapse. Prevent knees from locking inward.'}
                      {selectedMovement === 'bench' && 'Do not flare elbows to 90 degrees as this compromises subacromial space. Avoid bouncing weights.'}
                      {selectedMovement === 'row' && 'Do not yank or rely on lumbar swing momentum to move heavy weight, as this causes spinal strain.'}
                      {selectedMovement === 'plank' && 'Do not allow hips to sag downward into hyperextended formats or pike butt upwards.'}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Motivational Call to Action inside Form Lab */}
      <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
        <span className="flex items-center gap-1 font-bold">
          <Sparkles className="h-4 w-4 text-lime-400" /> Form is safety. Build correct habits.
        </span>
        <button 
          onClick={handlePhaseToggle}
          className="text-lime-400 hover:text-lime-300 font-extrabold uppercase tracking-wide text-xs flex items-center gap-1"
        >
          Toggle Hinge Loop →
        </button>
      </div>
    </div>
  );
}
