import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flame, Sparkles, Volume2, Info } from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../data/exercisesData';

const TEMPO_PRESETS = [
  { name: 'Strength Build (3-1-1-0)', eccentric: 3, pauseMax: 1, concentric: 1, pauseMin: 0, desc: 'Ideal for squats and bench presses' },
  { name: 'Time-Under-Tension (4-2-1-1)', eccentric: 4, pauseMax: 2, concentric: 1, pauseMin: 1, desc: 'Excellent for deep muscle tear & hypertrophy' },
  { name: 'Explosive Power (2-0-1-2)', eccentric: 2, pauseMax: 0, concentric: 1, pauseMin: 2, desc: 'Great for deadlifts and rows' }
];

export default function TempoCoach() {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTempo, setSelectedTempo] = useState(0);
  const [currentSegment, setCurrentSegment] = useState<'eccentric' | 'pauseMax' | 'concentric' | 'pauseMin'>('eccentric');
  const [secondsRemaining, setSecondsRemaining] = useState(3);
  const [completedReps, setCompletedReps] = useState(0);
  const [coachingText, setCoachingText] = useState('Press PLAY to start pacing');
  const [inspiration, setInspiration] = useState(MOTIVATIONAL_QUOTES[0]);

  const activeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const preset = TEMPO_PRESETS[selectedTempo];

  // Rotate motivation quote
  const rotateQuote = () => {
    const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setInspiration(MOTIVATIONAL_QUOTES[idx]);
  };

  useEffect(() => {
    rotateQuote();
    const interval = setInterval(rotateQuote, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isRunning) {
      activeIntervalRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            // Transition to the next segment of the lifting cycle
            let nextSegment: 'eccentric' | 'pauseMax' | 'concentric' | 'pauseMin';
            let nextDuration: number = 1;

            if (currentSegment === 'eccentric') {
              if (preset.pauseMax > 0) {
                nextSegment = 'pauseMax';
                nextDuration = preset.pauseMax;
                setCoachingText('HOLD & BRACE TIGHT!');
              } else {
                nextSegment = 'concentric';
                nextDuration = preset.concentric;
                setCoachingText('EXPLODE! DRIVE UP!');
              }
            } else if (currentSegment === 'pauseMax') {
              nextSegment = 'concentric';
              nextDuration = preset.concentric;
              setCoachingText('EXPLODE! DRIVE UP!');
            } else if (currentSegment === 'concentric') {
              if (preset.pauseMin > 0) {
                nextSegment = 'pauseMin';
                nextDuration = preset.pauseMin;
                setCoachingText('SQUEEZE & LOCK IN!');
              } else {
                nextSegment = 'eccentric';
                nextDuration = preset.eccentric;
                setCoachingText('Lower controlled... breathe in');
                setCompletedReps(r => r + 1);
              }
            } else {
              nextSegment = 'eccentric';
              nextDuration = preset.eccentric;
              setCoachingText('Lower controlled... breathe in');
              setCompletedReps(r => r + 1);
            }

            setCurrentSegment(nextSegment);
            return nextDuration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (activeIntervalRef.current) clearInterval(activeIntervalRef.current);
    }

    return () => {
      if (activeIntervalRef.current) clearInterval(activeIntervalRef.current);
    };
  }, [isRunning, currentSegment, selectedTempo]);

  const handleStart = () => {
    if (!isRunning) {
      setCurrentSegment('eccentric');
      setSecondsRemaining(preset.eccentric);
      setCoachingText('Lower controlled... breathe in');
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCompletedReps(0);
    setSecondsRemaining(preset.eccentric);
    setCurrentSegment('eccentric');
    setCoachingText('Press PLAY to start pacing');
  };

  const handleTempoChange = (index: number) => {
    setIsRunning(false);
    setSelectedTempo(index);
    const chosen = TEMPO_PRESETS[index];
    setSecondsRemaining(chosen.eccentric);
    setCurrentSegment('eccentric');
    setCompletedReps(0);
    setCoachingText('Press PLAY to start pacing');
  };

  // Compute visual circle scale based on segment
  const getCircleScale = () => {
    if (!isRunning) return 'scale-90';
    if (currentSegment === 'eccentric') {
      // Circle shrinking down
      const progress = secondsRemaining / preset.eccentric;
      return progress > 0.6 ? 'scale-125' : progress > 0.3 ? 'scale-105' : 'scale-90';
    }
    if (currentSegment === 'pauseMax') return 'scale-75 brightness-75';
    if (currentSegment === 'concentric') {
      // Circle stretching out
      return 'scale-115 border-teal-400';
    }
    // Squeeze hold
    return 'scale-130 shadow-[0_0_30px_rgba(16,185,129,0.4)]';
  };

  const getSegmentColor = () => {
    if (currentSegment === 'eccentric') return 'text-amber-400 border-amber-500/20';
    if (currentSegment === 'pauseMax') return 'text-rose-400 border-rose-500/20';
    if (currentSegment === 'concentric') return 'text-lime-400 border-lime-500/20';
    return 'text-cyan-400 border-cyan-500/20';
  };

  return (
    <div id="tempo-coach-panel" className="bg-zinc-900 border border-white/5 rounded-[2rem] p-6 shadow-2xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="bg-lime-400 text-zinc-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Tempo Trainer
            </span>
            <h3 className="text-2xl font-black italic uppercase text-white mt-2 flex items-center gap-1.5">
              <Flame className="h-5 w-5 text-lime-400" /> Rhythm & Focus
            </h3>
          </div>
          <Volume2 className="h-4 w-4 text-zinc-500 cursor-pointer hover:text-zinc-300" />
        </div>

        {/* Motivation Board of Wisdom */}
        <div className="bg-zinc-950 rounded-2xl p-4 border border-white/5 mb-5 text-center min-h-[90px] flex flex-col justify-center">
          <p className="text-xs text-lime-300 font-medium italic">"{inspiration.text}"</p>
          <p className="text-[10px] text-zinc-500 font-bold uppercase mt-2 tracking-widest">— {inspiration.author}</p>
        </div>

        {/* Selected Preset Selector */}
        <div className="space-y-1.5 mb-5 font-sans">
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Target Lifting Tempo</label>
          <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-xl border border-white/10">
            {TEMPO_PRESETS.map((t, idx) => (
              <button
                key={idx}
                onClick={() => handleTempoChange(idx)}
                className={`py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                  selectedTempo === idx
                    ? 'bg-lime-400 text-zinc-950 shadow scale-105'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {idx === 0 ? 'Strength' : idx === 1 ? 'Hypertrophy' : 'Power'}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-zinc-400 italic px-1 pt-0.5">{preset.desc}</p>
        </div>

        {/* Visual Breathing & Rhythm sphere */}
        <div className="flex flex-col items-center justify-center p-4 bg-zinc-950 rounded-2xl border border-white/5 relative overflow-hidden min-h-[180px]">
          {/* Dynamic pulsing circle */}
          <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${getCircleScale()} ${getSegmentColor()} bg-zinc-900 border-dashed`}>
            <span className="text-3xl font-extrabold tracking-tight font-mono">{secondsRemaining}s</span>
            <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">{currentSegment}</span>
          </div>

          <div className="mt-4 text-center">
            <span className={`text-xs font-black uppercase tracking-widest block ${getSegmentColor()}`}>
              {coachingText}
            </span>
            <span className="text-[10px] text-zinc-500 mt-1 block font-bold">
              Completed Reps: <span className="font-mono font-black text-zinc-200">{completedReps}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        <button
          onClick={handleReset}
          className="bg-zinc-950 hover:bg-zinc-850 border border-white/10 py-2.5 rounded-xl text-xs font-bold uppercase text-zinc-400 hover:text-zinc-200 transition-colors flex items-center justify-center gap-1"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>

        <button
          onClick={handleStart}
          className={`col-span-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            isRunning 
              ? 'bg-zinc-850 border border-white/10 text-lime-400 hover:bg-zinc-800' 
              : 'bg-lime-400 hover:bg-lime-300 text-zinc-950 shadow-lg shadow-lime-400/10'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="h-3.5 w-3.5 fill-current" /> Pause Coach
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" /> Start Pace Loop
            </>
          )}
        </button>
      </div>
    </div>
  );
}
