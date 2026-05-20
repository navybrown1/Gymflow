import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Dumbbell, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Play, 
  BookOpen, 
  Info, 
  ThumbsUp, 
  Maximize2,
  Clock
} from 'lucide-react';
import { ExerciseFormDetails, ToastMessage } from '../types';

const EXERCISE_VIDEOS: Record<number, string> = {
  1: 'gRVjAtPip0Y', // Barbell Bench Press (Buff Dudes - Correct & verified)
  2: 'b4SgNf6K1vA', // Incline Dumbbell Fly (ScottHogan - Correct & verified)
  3: 'yHAOCU96-uU', // Barbell Back Squat (Buff Dudes - Correct & verified)
  4: 'hCDzSR6bW10', // Romanian Deadlift (ScottHogan - Correct & verified)
  5: 'CAwf7n6Luuc', // Lat Pulldown (Buff Dudes - Correct & verified)
  6: 'kBWAon6-_9E', // Bent Over Row (ScottHogan - Correct & verified)
  7: '2D_AueW_0_E', // Seated Dumbbell Shoulder Press (ScottHogan - Correct & verified)
  8: 'pSHjTRCQxIw', // Plank Hold (Buff Dudes - Correct & verified)
};

interface ExerciseDetailDrawerProps {
  exercise: ExerciseFormDetails | null;
  onClose: () => void;
  onAddToSession?: (exercise: any) => void;
  isSessionActive: boolean;
  triggerToast: (msg: string, type?: any) => void;
}

export default function ExerciseDetailDrawer({ 
  exercise, 
  onClose, 
  onAddToSession, 
  isSessionActive,
  triggerToast 
}: ExerciseDetailDrawerProps) {
  
  const [calibrationChecks, setCalibrationChecks] = useState<Record<string, boolean>>({});

  if (!exercise) return null;

  const handleToggleCheck = (cue: string) => {
    setCalibrationChecks(prev => {
      const next = { ...prev, [cue]: !prev[cue] };
      const checkedCount = Object.values(next).filter(Boolean).length;
      if (checkedCount === exercise.correctFormCues.length) {
        triggerToast(`🔥 Mind-Muscle connection CALIBRATED for ${exercise.name}! Ready to lift heavy!`, 'success');
      }
      return next;
    });
  };

  const score = Math.round(
    (Object.values(calibrationChecks).filter(Boolean).length / exercise.correctFormCues.length) * 100
  );

  return (
    <div id="exercise-form-drawer" className="fixed inset-0 z-50 flex items-center justify-end bg-zinc-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 200 }}
        className="bg-zinc-900 border border-white/5 rounded-3xl w-full max-w-lg h-[calc(100vh-32px)] flex flex-col justify-between overflow-hidden shadow-2xl relative"
      >
        {/* Visual Top Background Banner */}
        <div className="relative h-44 flex-shrink-0">
          <img 
            src={exercise.photoUrl} 
            alt={exercise.name} 
            className="w-full h-full object-cover filter brightness-[0.4] contrast-110 saturate-[0.85]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
          
          {/* Top Control Buttons inside Banner */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="bg-lime-400 text-zinc-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow">
              {exercise.category} · {exercise.mechanicsType}
            </span>

            <button 
              onClick={onClose}
              className="bg-zinc-950/80 p-2 rounded-xl text-zinc-300 hover:text-white border border-white/10 backdrop-blur-sm transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute bottom-3 left-6 right-6">
            <span className="text-[10px] text-lime-400 font-black uppercase tracking-widest">Form & Movement Anatomy</span>
            <h2 className="text-3xl font-black italic uppercase text-white tracking-tight leading-none mt-1">{exercise.name}</h2>
          </div>
        </div>

        {/* Scrollable Clinical Instruction Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 font-sans">
          
          {/* Motivation Quote Cards */}
          <div className="relative overflow-hidden bg-gradient-to-r from-lime-950/30 to-zinc-950 p-4 rounded-2xl border border-lime-400/10 shadow flex gap-3">
            <Sparkles className="h-5 w-5 text-lime-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-lime-200 italic font-medium">"{exercise.motivationQuote}"</p>
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mt-1.5 font-bold">Psychological Drive Alert</span>
            </div>
          </div>

          {/* Quick Metrics stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-zinc-950 p-3 rounded-xl border border-white/10 text-center">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Equipment</span>
              <span className="text-xs text-white font-black block mt-1 truncate">{exercise.equipment}</span>
            </div>
            <div className="bg-zinc-950 p-3 rounded-xl border border-white/10 text-center">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Form Tempo</span>
              <span className="text-xs text-lime-400 font-mono font-black block mt-1">{exercise.tempo}</span>
            </div>
            <div className="bg-zinc-950 p-3 rounded-xl border border-white/10 text-center">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Mechanics</span>
              <span className="text-xs text-cyan-400 font-black block mt-1">{exercise.mechanicsType}</span>
            </div>
          </div>

          {/* Core Description block */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-lime-400" /> Movement Standard
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950 p-3.5 rounded-xl border border-white/5">
              {exercise.description}
            </p>
          </div>

          {/* Real Human Athlete Demo Video Section */}
          {EXERCISE_VIDEOS[exercise.id] && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5 text-lime-400 fill-current" /> Real Athlete Video Loop
              </h4>
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black relative shadow-lg">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${EXERCISE_VIDEOS[exercise.id]}?autoplay=1&mute=1&loop=1&playlist=${EXERCISE_VIDEOS[exercise.id]}&controls=1&playsinline=1&enablejsapi=1`}
                  title={`${exercise.name} Real Athlete Video Demo`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono text-center">
                Live interactive demonstration showing correct biomechanical alignment.
              </p>
            </div>
          )}

          {/* Mind-Muscle connection directive */}
          <div className="bg-zinc-950 rounded-2xl border border-white/10 p-4 space-y-1.55">
            <h4 className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-cyan-400" /> Mind-Muscle Integration Focus
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {exercise.mindMuscleFocus}
            </p>
          </div>

          {/* Checklist: Positive alignment guidelines */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                <ThumbsUp className="h-4 w-4 text-lime-400" /> Correct Execution Standard
              </h4>
              <span className="text-[10px] font-mono text-zinc-500">
                Connection Calibration: <span className={`font-black uppercase ${score === 100 ? 'text-lime-400' : 'text-amber-400'}`}>{score}%</span>
              </span>
            </div>

            {/* Micro progress meter */}
            <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-lime-400 h-full transition-all duration-300"
                style={{ width: `${score}%` }}
              />
            </div>

            <div className="space-y-2">
              {exercise.correctFormCues.map((cue, idx) => {
                const checked = !!calibrationChecks[cue];
                return (
                  <div 
                    key={idx}
                    onClick={() => handleToggleCheck(cue)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      checked 
                        ? 'bg-lime-500/5  border-lime-500/20 text-zinc-200' 
                        : 'bg-zinc-950 border-white/5 text-zinc-400 hover:text-zinc-300 hover:border-white/10'
                    }`}
                  >
                    <div className={`mt-0.5 h-4.5 w-4.5 flex items-center justify-center rounded-lg border transition-all ${
                      checked 
                        ? 'bg-lime-400 border-lime-400 text-zinc-950' 
                        : 'border-zinc-800 bg-zinc-950'
                    }`}>
                      {checked && <Check className="h-3 w-3 stroke-[3px]" />}
                    </div>
                    <span className="text-xs select-none transition-all">{cue}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Warning Block: Mistakes to omit */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4" /> Pitfalls to Avoid
            </h4>
            <div className="space-y-2">
              {exercise.commonMistakes.map((mistake, idx) => (
                <div key={idx} className="bg-rose-950/20 border border-rose-950 rounded-xl p-3 flex gap-2.5">
                  <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-rose-200 leading-relaxed">{mistake}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Action Bar */}
        <div className="p-4 bg-zinc-950 border-t border-white/10 flex gap-2 items-center">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-xl text-xs font-black uppercase text-zinc-300 transition-colors"
          >
            Close Spec Details
          </button>
          
          {onAddToSession && isSessionActive && (
            <button 
              onClick={() => {
                onAddToSession(exercise);
                onClose();
              }}
              className="flex-1 py-3 bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-lime-400/10 transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-current" /> Inject into Session
            </button>
          )}
        </div>

      </motion.div>
    </div>
  );
}
