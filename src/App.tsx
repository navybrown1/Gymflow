import React, { useState, useEffect, useRef } from 'react';
import { 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  Plus, 
  Check, 
  Trash2, 
  Play, 
  PlusCircle, 
  User, 
  Clock, 
  Flame, 
  Scale, 
  Activity, 
  ChevronRight, 
  Search, 
  X,
  PlusSquare,
  Sparkles,
  Info,
  Trophy,
  Compass,
  CheckCircle2,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

import { 
  SetRecord, 
  WorkoutExercise, 
  WorkoutSession, 
  BiometricRecord, 
  ExerciseFormDetails, 
  ToastMessage 
} from './types';
import { EXERCISES_LIBRARY, MOTIVATIONAL_QUOTES } from './data/exercisesData';
import BiomechanicalModel from './components/BiomechanicalModel';
import TempoCoach from './components/TempoCoach';
import ExerciseDetailDrawer from './components/ExerciseDetailDrawer';

const INITIAL_WORKOUTS: WorkoutSession[] = [
  {
    id: 'w1',
    name: 'Push Strength Focus',
    date: '2026-05-15',
    duration: 2700, // 45 mins
    totalVolume: 8200, // lbs
    exercises: [
      {
        exerciseId: 1,
        exerciseName: 'Barbell Bench Press',
        sets: [
          { set_id: 1, weight: 135, reps: 12, completed: true },
          { set_id: 2, weight: 185, reps: 10, completed: true },
          { set_id: 3, weight: 205, reps: 8, completed: true },
          { set_id: 4, weight: 225, reps: 5, completed: true }
        ]
      },
      {
        exerciseId: 7,
        exerciseName: 'Seated Dumbbell Shoulder Press',
        sets: [
          { set_id: 5, weight: 50, reps: 10, completed: true },
          { set_id: 6, weight: 55, reps: 10, completed: true },
          { set_id: 7, weight: 60, reps: 8, completed: true }
        ]
      }
    ]
  },
  {
    id: 'w2',
    name: 'Pull Hypertrophy Routine',
    date: '2026-05-17',
    duration: 3100, // 51 mins
    totalVolume: 6400,
    exercises: [
      {
        exerciseId: 5,
        exerciseName: 'Lat Pulldown',
        sets: [
          { set_id: 8, weight: 120, reps: 12, completed: true },
          { set_id: 9, weight: 140, reps: 10, completed: true },
          { set_id: 10, weight: 150, reps: 10, completed: true }
        ]
      },
      {
        exerciseId: 6,
        exerciseName: 'Bent Over Row',
        sets: [
          { set_id: 11, weight: 135, reps: 10, completed: true },
          { set_id: 12, weight: 155, reps: 8, completed: true },
          { set_id: 13, weight: 155, reps: 8, completed: true }
        ]
      }
    ]
  }
];

const INITIAL_BIOMETRICS: BiometricRecord[] = [
  { date: '05/01', weight: 184.2, bodyFat: 16.5 },
  { date: '05/05', weight: 183.1, bodyFat: 16.4 },
  { date: '05/08', weight: 183.5, bodyFat: 16.2 },
  { date: '05/12', weight: 182.0, bodyFat: 16.0 },
  { date: '05/16', weight: 181.4, bodyFat: 15.9 },
  { date: '05/19', weight: 180.8, bodyFat: 15.8 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [exercises, setExercises] = useState<ExerciseFormDetails[]>(EXERCISES_LIBRARY);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>(INITIAL_WORKOUTS);
  const [biometrics, setBiometrics] = useState<BiometricRecord[]>(INITIAL_BIOMETRICS);
  
  // Custom toast list
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Modals & Overlays
  const [showAddExerciseModal, setShowAddExerciseModal] = useState<boolean>(false);
  const [showEndWorkoutModal, setShowEndWorkoutModal] = useState<boolean>(false);
  const [selectedSpecExercise, setSelectedSpecExercise] = useState<ExerciseFormDetails | null>(null);
  
  // Forms & creation state
  const [newExercise, setNewExercise] = useState({ 
    name: '', 
    category: 'Chest', 
    equipment: 'Barbell', 
    description: '',
    motivationQuote: '',
    mindMuscleFocus: ''
  });
  const [newBiometric, setNewBiometric] = useState({ weight: '', bodyFat: '' });

  // Workout live states
  const [activeSession, setActiveSession] = useState<Omit<WorkoutSession, 'id' | 'duration' | 'totalVolume'> | null>(null);
  const [activeTimer, setActiveTimer] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Timer tick setup
  useEffect(() => {
    if (activeSession) {
      timerRef.current = setInterval(() => {
        setActiveTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setActiveTimer(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSession]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = (templateName = 'Custom Session') => {
    if (activeSession) {
      triggerToast('A lifting session is already live. Finalize or discard it first!', 'warning');
      return;
    }
    setActiveSession({
      name: templateName,
      date: new Date().toISOString().split('T')[0],
      exercises: []
    });
    setActiveTimer(0);
    triggerToast(`⚡ Session "${templateName}" initiated! Focus on your form.`, 'success');
    setActiveTab('workout');
  };

  const cancelWorkout = () => {
    setActiveSession(null);
    setActiveTimer(0);
    triggerToast('Workout session discarded.', 'error');
    setActiveTab('dashboard');
  };

  const addExerciseToActiveWorkout = (exercise: ExerciseFormDetails) => {
    if (!activeSession) return;
    
    const alreadyAdded = activeSession.exercises.some(e => e.exerciseId === exercise.id);
    if (alreadyAdded) {
      triggerToast(`${exercise.name} is already in this workout roster!`, 'warning');
      return;
    }

    const updatedExercises: WorkoutExercise[] = [...activeSession.exercises, {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: [
        { set_id: Date.now() + 1, weight: 135, reps: 10, completed: false }
      ]
    }];

    setActiveSession({
      ...activeSession,
      exercises: updatedExercises
    });
    triggerToast(`Added ${exercise.name} to workout roster`, 'success');
  };

  const removeExerciseFromActiveWorkout = (index: number) => {
    if (!activeSession) return;
    const updatedExercises = activeSession.exercises.filter((_, idx) => idx !== index);
    setActiveSession({
      ...activeSession,
      exercises: updatedExercises
    });
  };

  const addSetToExercise = (exerciseIdx: number) => {
    if (!activeSession) return;
    const exercise = activeSession.exercises[exerciseIdx];
    const lastSet = exercise.sets[exercise.sets.length - 1] || { weight: 135, reps: 10 };
    
    const newSet: SetRecord = {
      set_id: Date.now(),
      weight: lastSet.weight,
      reps: lastSet.reps,
      completed: false
    };

    const updatedExercises = [...activeSession.exercises];
    updatedExercises[exerciseIdx].sets.push(newSet);

    setActiveSession({
      ...activeSession,
      exercises: updatedExercises
    });
  };

  const removeSetFromExercise = (exerciseIdx: number, setIdx: number) => {
    if (!activeSession) return;
    const updatedExercises = [...activeSession.exercises];
    updatedExercises[exerciseIdx].sets = updatedExercises[exerciseIdx].sets.filter((_, idx) => idx !== setIdx);
    
    if (updatedExercises[exerciseIdx].sets.length === 0) {
      updatedExercises.splice(exerciseIdx, 1);
    }

    setActiveSession({
      ...activeSession,
      exercises: updatedExercises
    });
  };

  const updateSetValues = (exerciseIdx: number, setIdx: number, field: 'weight' | 'reps', value: string) => {
    if (!activeSession) return;
    const updatedExercises = [...activeSession.exercises];
    updatedExercises[exerciseIdx].sets[setIdx][field] = Number(value) || 0;
    setActiveSession({
      ...activeSession,
      exercises: updatedExercises
    });
  };

  const toggleSetCompleted = (exerciseIdx: number, setIdx: number) => {
    if (!activeSession) return;
    const updatedExercises = [...activeSession.exercises];
    const completedState = !updatedExercises[exerciseIdx].sets[setIdx].completed;
    updatedExercises[exerciseIdx].sets[setIdx].completed = completedState;
    setActiveSession({
      ...activeSession,
      exercises: updatedExercises
    });

    if (completedState) {
      triggerToast(`Set marked complete! Mechanical stress recorded.`, 'info');
    }
  };

  const calculateSessionVolume = (session: typeof activeSession) => {
    if (!session) return 0;
    return session.exercises.reduce((acc, ex) => {
      return acc + ex.sets.reduce((setAcc, set) => {
        return set.completed ? setAcc + (set.weight * set.reps) : setAcc;
      }, 0);
    }, 0);
  };

  const finishWorkout = () => {
    if (!activeSession || activeSession.exercises.length === 0) {
      triggerToast('Add exercises and complete sets before completing.', 'error');
      setShowEndWorkoutModal(false);
      return;
    }

    const totalVolume = calculateSessionVolume(activeSession);
    const completedExercises = activeSession.exercises.map(ex => ({
      ...ex,
      sets: ex.sets.filter(s => s.completed)
    })).filter(ex => ex.sets.length > 0);

    if (completedExercises.length === 0) {
      triggerToast('Complete and check at least one set before logging.', 'warning');
      setShowEndWorkoutModal(false);
      return;
    }

    const newWorkoutLog: WorkoutSession = {
      id: 'w_' + Date.now(),
      name: activeSession.name,
      date: new Date().toISOString().split('T')[0],
      duration: activeTimer,
      totalVolume,
      exercises: completedExercises
    };

    setWorkoutHistory([newWorkoutLog, ...workoutHistory]);
    setActiveSession(null);
    setActiveTimer(0);
    setShowEndWorkoutModal(false);
    triggerToast('🏆 Workout logged successfully! Mechanical stats synced.', 'success');
    setActiveTab('dashboard');
  };

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExercise.name.trim()) {
      triggerToast('Please provide a valid exercise name', 'error');
      return;
    }

    const created: ExerciseFormDetails = {
      id: exercises.length + 1,
      name: newExercise.name,
      category: newExercise.category,
      equipment: newExercise.equipment,
      trackingType: 'weight_reps',
      description: newExercise.description || 'Custom muscle recruitment movement.',
      photoUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=650',
      motivationQuote: newExercise.motivationQuote || 'Perfect form drives perfect growth. Stay focused.',
      mindMuscleFocus: newExercise.mindMuscleFocus || 'Concentrate on slow contractions and steady control.',
      correctFormCues: [
        'Keep spine in neutral, safe alignment',
        'Inhale on the eccentric phase, exhale on target drive path',
        'Limit momentum and leverage control'
      ],
      commonMistakes: [
        'Swinging or bouncing the weights to carry load',
        'Hyperextending joints at outer range boundaries'
      ],
      mechanicsType: 'Isolation',
      tempo: '3-0-1-0',
      tempoSeconds: { eccentric: 3, pauseMax: 0, concentric: 1, pauseMin: 0 }
    };

    setExercises([created, ...exercises]);
    setNewExercise({ 
      name: '', 
      category: 'Chest', 
      equipment: 'Barbell', 
      description: '',
      motivationQuote: '',
      mindMuscleFocus: ''
    });
    setShowAddExerciseModal(false);
    triggerToast(`Added ${created.name} to Universal Catalog!`, 'success');
  };

  const handleLogBiometrics = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBiometric.weight) {
      triggerToast('Body Weight is required', 'error');
      return;
    }

    const today = new Date();
    const formattedDate = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;
    
    const entry: BiometricRecord = {
      date: formattedDate,
      weight: parseFloat(newBiometric.weight),
      bodyFat: newBiometric.bodyFat ? parseFloat(newBiometric.bodyFat) : null
    };

    setBiometrics([...biometrics, entry]);
    setNewBiometric({ weight: '', bodyFat: '' });
    triggerToast('Biometrics ledger updated!', 'success');
  };

  const [exerciseSearch, setExerciseSearch] = useState<string>('');
  const [exerciseFilterCategory, setExerciseFilterCategory] = useState<string>('All');

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(exerciseSearch.toLowerCase());
    const matchesCategory = exerciseFilterCategory === 'All' || ex.category === exerciseFilterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-lime-400 selection:text-zinc-950">
      
      {/* Toast Notification HUD */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`p-4 rounded-xl border shadow-2xl flex items-center gap-3 transition-all transform translate-y-0 opacity-100 pointer-events-auto ${
              toast.type === 'error' ? 'bg-rose-950/95 border-rose-800 text-rose-200' :
              toast.type === 'warning' ? 'bg-amber-950/95 border-amber-800 text-amber-200' :
              toast.type === 'info' ? 'bg-blue-950/95 border-blue-800 text-blue-200' :
              'bg-zinc-900 border-lime-400 text-lime-200'
            }`}
          >
            <Sparkles className="h-4.5 w-4.5 flex-shrink-0 text-lime-400" />
            <span className="text-xs font-semibold">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Header Bar */}
      <header className="bg-zinc-900/40 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-lime-400 text-zinc-950 p-2.5 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.3)]">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-lime-400 to-cyan-400 bg-clip-text text-transparent font-display">GYMFLOW</span>
              <span className="text-[9px] block text-zinc-500 uppercase tracking-widest font-black font-display">Safety & Performance Console</span>
            </div>
          </div>

          {/* Prompt banner to return to active workouts */}
          {activeSession && activeTab !== 'workout' && (
            <button 
              onClick={() => setActiveTab('workout')}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-lime-400/10 border border-lime-400/20 text-lime-400 rounded-xl text-xs font-semibold animate-pulse"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>ACTIVE SESSION LIVE ({formatTime(activeTimer)})</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400 bg-zinc-950/50 px-3 py-1.5 rounded-xl border border-white/5">
              <User className="h-3.5 w-3.5 text-lime-400" />
              <span>Athlete Peter Parker</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Promo / Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-lime-950/40 to-zinc-950 border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="relative z-10 max-w-2xl">
                <span className="inline-block px-2.5 py-1 bg-lime-400/10 text-lime-400 text-[10px] font-black rounded-full mb-3 uppercase tracking-widest font-display">
                  Biomechanical Optimization
                </span>
                <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tight text-white leading-none font-display">Correct Form Prevents Pain, Multiplies Gain</h2>
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                  Every exercise in our library includes precise visual demonstrators, perfect posture cues, and tempo controllers to maximize safety and mind-muscle intensity.
                </p>
              </div>
              <div className="relative z-10 flex flex-wrap gap-2.5">
                {activeSession ? (
                  <button 
                    onClick={() => setActiveTab('workout')}
                    className="bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black px-6 py-3.5 rounded-2xl flex items-center gap-2 text-sm shadow-xl shadow-lime-400/20 transition-all hover:scale-[1.01]"
                  >
                    <Activity className="h-4.5 w-4.5" />
                    Resume Current Workout
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => setActiveTab('coach')}
                      className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold px-5 py-3.5 rounded-2xl border border-white/5 text-sm transition-all flex items-center gap-2"
                    >
                      <Compass className="h-4 w-4 text-lime-400" />
                      Explore Form Lab
                    </button>
                    <button 
                      onClick={() => startWorkout('Custom Session')}
                      className="bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black px-6 py-3.5 rounded-2xl flex items-center gap-2 text-sm shadow-xl shadow-lime-400/20 transition-all hover:scale-[1.01]"
                    >
                      <Play className="h-4.5 w-4.5 fill-current" />
                      Start Custom Lift
                    </button>
                  </>
                )}
              </div>
              
              {/* Decorative radial gradients in background */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-lime-400/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            </div>

            {/* Micro Dashboard Statistics Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Completed Sessions</span>
                  <div className="p-2 bg-lime-400/10 text-lime-400 rounded-xl">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white">{workoutHistory.length}</h3>
                <p className="text-zinc-500 text-[10px] mt-1 font-bold uppercase font-display">Aggregate completed logs</p>
              </div>

              <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Mechanical Load</span>
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                    <Trophy className="h-4.5 w-4.5" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white">
                  {workoutHistory.reduce((acc, w) => acc + w.totalVolume, 0).toLocaleString()} <span className="text-xs font-semibold text-zinc-500">lbs</span>
                </h3>
                <p className="text-zinc-500 text-[10px] mt-1 font-bold uppercase font-sans">Accumulated weight volume</p>
              </div>

              <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Athlete Body Weight</span>
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
                    <Scale className="h-4.5 w-4.5" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white">
                  {biometrics.length > 0 ? biometrics[biometrics.length - 1].weight : '--'} <span className="text-xs font-semibold text-zinc-500">lbs</span>
                </h3>
                <p className="text-zinc-500 text-[10px] mt-1 font-bold uppercase">Scheduled scales record</p>
              </div>

              <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Subcutaneous Fat</span>
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                    <Flame className="h-4.5 w-4.5" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white">
                  {biometrics.length > 0 && biometrics[biometrics.length - 1].bodyFat ? `${biometrics[biometrics.length - 1].bodyFat}%` : '--'}
                </h3>
                <p className="text-zinc-500 text-[10px] mt-1 font-bold uppercase">Estimated lipid tier</p>
              </div>
            </div>

            {/* Split layout: Recent workouts vs Biometrics Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* History Timeline */}
              <div className="lg:col-span-2 bg-zinc-900 border border-white/5 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-black italic uppercase text-white tracking-tight font-display">Athlete Logging Ledger</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">Verified logs containing completed sets</p>
                  </div>

                  <button 
                    onClick={() => setActiveTab('workout')}  
                    className="text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    Manage Active Logger <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {workoutHistory.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl">
                      <Dumbbell className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm font-semibold">Ready to register lifting logs?</p>
                      <button onClick={() => startWorkout()} className="text-emerald-400 text-xs mt-1 underline">Start a blank session now</button>
                    </div>
                  ) : (
                    workoutHistory.map(w => (
                      <div key={w.id} className="bg-slate-950/60 hover:bg-slate-950 border border-slate-850 hover:border-slate-800 p-4 rounded-2xl transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
                          <div>
                            <span className="text-[10px] bg-slate-900 text-slate-400 font-bold px-2 py-0.5 rounded-md border border-slate-850">
                              Logged session File
                            </span>
                            <h4 className="font-extrabold text-white text-base mt-1">{w.name}</h4>
                            <span className="text-slate-500 text-xs flex items-center gap-1.5 mt-1 font-semibold">
                              <Calendar className="h-3 w-3" /> {w.date}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-1.5 bg-slate-900 text-slate-300 border border-slate-850 rounded-xl text-xs font-mono font-bold">
                              Vol: {w.totalVolume.toLocaleString()} lbs
                            </span>
                            <span className="px-3 py-1.5 bg-slate-900 text-slate-300 border border-slate-850 rounded-xl text-xs font-mono font-bold">
                              Time: {formatTime(w.duration)}
                            </span>
                          </div>
                        </div>

                        {/* Completed Muscle Movements lists */}
                        <div className="border-t border-slate-900 pt-3 flex flex-wrap gap-2">
                          {w.exercises.map((ex, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => {
                                const matched = exercises.find(e => e.id === ex.exerciseId);
                                if (matched) setSelectedSpecExercise(matched);
                              }}
                              className="group bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-300 border border-slate-850 flex items-center gap-2 cursor-pointer transition-all"
                            >
                              <span className="font-mono font-black text-emerald-400">{ex.sets.length}x</span> 
                              <span className="group-hover:text-emerald-400 transition-colors font-medium">{ex.exerciseName}</span>
                              <Info className="h-3 w-3 text-slate-600 group-hover:text-slate-400 transition-all ml-1" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sidebar metrics check */}
              <div className="space-y-6">
                
                {/* Weight scale log card */}
                <div className="bg-slate-900 border border-slate-900 rounded-3xl p-6">
                  <h3 className="text-base font-black text-white">Track Scales History</h3>
                  <p className="text-slate-500 text-xs mt-0.5 mb-4">Register modern body index entries to compute analytics charts</p>

                  <form onSubmit={handleLogBiometrics} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] text-slate-500 uppercase tracking-widest font-black mb-1">Body Weight (lbs)</label>
                        <input 
                          type="number"
                          step="0.1"
                          placeholder="e.g. 180"
                          value={newBiometric.weight}
                          onChange={(e) => setNewBiometric({...newBiometric, weight: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 outline-none p-2.5 rounded-xl text-xs font-extrabold text-white transition-all font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-500 uppercase tracking-widest font-black mb-1">Fat Tier %</label>
                        <input 
                          type="number"
                          step="0.1"
                          placeholder="e.g. 15"
                          value={newBiometric.bodyFat}
                          onChange={(e) => setNewBiometric({...newBiometric, bodyFat: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 outline-none p-2.5 rounded-xl text-xs font-extrabold text-white transition-all font-mono"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="h-4 w-4" /> Save scale record
                    </button>
                  </form>
                </div>

                {/* Dashboard micro-chart preview */}
                <div className="bg-slate-900 border border-slate-900 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-black text-white">Physical Mass Trend</h3>
                    <TrendingDown className="h-4 w-4 text-emerald-400" />
                  </div>
                  
                  <div className="h-32 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={biometrics}>
                        <defs>
                          <linearGradient id="dashboardWeightGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vert={false} />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={9} />
                        <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide={true} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                          labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}
                          itemStyle={{ color: '#10b981', fontSize: '11px' }}
                        />
                        <Area type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#dashboardWeightGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Form Coach & Motivation Hub Tab */}
        {activeTab === 'coach' && (
          <div className="space-y-6">
            
            <div className="border-b border-slate-900 pb-5">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider">
                Vibe Check & Safety Lab
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">Perfect Form & Motivation Center</h2>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Tune your kinetic movement patterns perfectly. Watch the biomechanical bone simulator and lift at correct, safe muscle tempos.
              </p>
            </div>

            {/* Split Coach widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Biomechanical demonstrator */}
              <BiomechanicalModel />

              {/* Tempo & motivational speech coach */}
              <TempoCoach />
            </div>

            {/* Quick reference guide list */}
            <div className="bg-slate-900 border border-slate-900 rounded-3xl p-6">
              <h3 className="text-lg font-black text-white">Interactive Form Cheat Sheets</h3>
              <p className="text-slate-500 text-xs mt-0.5 mb-6">Select any athletic movement below to review anatomical cues and common mistakes instantly</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exercises.map((ex) => (
                  <div 
                    key={ex.id}
                    onClick={() => setSelectedSpecExercise(ex)}
                    className="group bg-slate-950 p-4 rounded-2xl border border-slate-850 hover:border-slate-700 hover:bg-slate-950/80 cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-full uppercase">
                          {ex.category}
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono font-bold">Tempo: {ex.tempo}</span>
                      </div>
                      <h4 className="font-black text-white text-base mt-3 group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                        {ex.name}
                        <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-emerald-400 transition-all transform group-hover:translate-x-1" />
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">{ex.description}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Form Calibrated
                      </span>
                      <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] opacity-100 group-hover:opacity-100 transition-opacity">
                        Review Spec →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Active Session Tab */}
        {activeTab === 'workout' && (
          <div>
            {!activeSession ? (
              <div className="max-w-2xl mx-auto text-center py-16 bg-slate-900 border border-slate-900 rounded-3xl p-8 shadow-xl space-y-6">
                <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-bounce">
                  <Dumbbell className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">Active Training Logger Terminal</h2>
                <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                  Initiate a custom protocol session or choose pre-built lifting routines to record sets, weights, and reps.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                  <button 
                    onClick={() => startWorkout('Custom Session')}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-xl shadow-emerald-500/15 transition-all hover:scale-[1.01]"
                  >
                    <Plus className="h-4 w-4" /> Start Blank Session
                  </button>
                  <button 
                    onClick={() => startWorkout('Leg Day Hypertrophy')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-6 py-3.5 rounded-2xl border border-slate-700 text-sm transition-colors"
                  >
                    Use Leg Template
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Logger Panel Column */}
                <div className="lg:col-span-2 space-y-4">
                  
                  {/* Current workout headers */}
                  <div className="bg-slate-900 border border-slate-900 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">TELEMETRY RUNNING</span>
                      <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">{activeSession.name}</h2>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-widest">Clock Time</span>
                          <span className="font-mono text-base font-bold text-white">{formatTime(activeTimer)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-90">
                        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                          <Activity className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-widest font-sans">Est. Volume</span>
                          <span className="font-mono text-base font-bold text-white">
                            {calculateSessionVolume(activeSession).toLocaleString()} lbs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Exercises array lists */}
                  {activeSession.exercises.length === 0 ? (
                    <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-16 text-center">
                      <PlusSquare className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                      <h4 className="font-extrabold text-slate-300 text-base">Workout is empty</h4>
                      <p className="text-slate-500 text-xs mt-1 max-w-xs mx-auto leading-relaxed">
                        Search and select chest, back or leg exercises from the sidebar database to copy them directly into this active tracker.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeSession.exercises.map((exercise, exerciseIdx) => {
                        const originalExercise = exercises.find(ex => ex.id === exercise.id);
                        return (
                          <div key={exerciseIdx} className="bg-slate-900 border border-slate-900 rounded-3xl overflow-hidden shadow-lg">
                            
                            {/* Exercise header info */}
                            <div className="bg-slate-950/70 p-4 border-b border-slate-850/60 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-xs font-bold font-mono">
                                  #{exerciseIdx + 1}
                                </span>
                                <div>
                                  <h3 className="font-black text-white text-base leading-tight">
                                    {exercise.exerciseName}
                                  </h3>
                                  {originalExercise && (
                                    <span className="text-[9px] text-slate-500 font-bold uppercase block mt-0.5">
                                      Tempo Segmented: {originalExercise.tempo} · {originalExercise.equipment}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                {originalExercise && (
                                  <button
                                    onClick={() => setSelectedSpecExercise(originalExercise)}
                                    className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors flex items-center gap-1.5 mr-1"
                                    title="View correctness guides and athlete form photos"
                                  >
                                    <Info className="h-3.5 w-3.5" />
                                    <span>Form Guide</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => removeExerciseFromActiveWorkout(exerciseIdx)}
                                  className="text-slate-500 hover:text-rose-400 p-2 rounded-xl hover:bg-rose-500/10 transition-all"
                                  title="Remove exercise"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Sets configuration layout table */}
                            <div className="p-5">
                              <div className="grid grid-cols-12 gap-2 text-center text-[9px] font-bold text-slate-500 uppercase tracking-widest pb-3 border-b border-slate-850">
                                <span className="col-span-2 text-left">Set Row</span>
                                <span className="col-span-4">Weight (lbs)</span>
                                <span className="col-span-4">Target Reps</span>
                                <span className="col-span-2">Completed</span>
                              </div>

                              <div className="divide-y divide-slate-850 mt-2 space-y-2">
                                {exercise.sets.map((set, setIdx) => (
                                  <div 
                                    key={set.set_id}
                                    className={`grid grid-cols-12 gap-2 py-2.5 items-center transition-all ${
                                      set.completed ? 'bg-emerald-500/5 -mx-5 px-5' : ''
                                    }`}
                                  >
                                    {/* Set row identifier */}
                                    <div className="col-span-2 flex items-center gap-2">
                                      <span className="text-xs font-mono font-bold text-slate-400">#{setIdx + 1}</span>
                                      <button 
                                        onClick={() => removeSetFromExercise(exerciseIdx, setIdx)}
                                        className="text-slate-600 hover:text-rose-400 transition-colors"
                                        title="Delete row"
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </button>
                                    </div>

                                    {/* Weights settings */}
                                    <div className="col-span-4 flex justify-center">
                                      <input 
                                        type="number"
                                        value={set.weight || ''}
                                        placeholder="135"
                                        onChange={(e) => updateSetValues(exerciseIdx, setIdx, 'weight', e.target.value)}
                                        disabled={set.completed}
                                        className="w-24 text-center bg-slate-950 border border-slate-800 focus:border-emerald-500 outline-none px-2 py-1.5 rounded-xl text-xs text-white font-extrabold font-mono disabled:opacity-50 disabled:bg-slate-900"
                                      />
                                    </div>

                                    {/* Reps settings */}
                                    <div className="col-span-4 flex justify-center">
                                      <input 
                                        type="number"
                                        value={set.reps || ''}
                                        placeholder="10"
                                        onChange={(e) => updateSetValues(exerciseIdx, setIdx, 'reps', e.target.value)}
                                        disabled={set.completed}
                                        className="w-16 text-center bg-slate-950 border border-slate-800 focus:border-emerald-500 outline-none px-2 py-1.5 rounded-xl text-xs text-white font-extrabold font-mono disabled:opacity-50 disabled:bg-slate-900"
                                      />
                                    </div>

                                    {/* Set complete checkbox status layout */}
                                    <div className="col-span-2 flex justify-center">
                                      <button 
                                        onClick={() => toggleSetCompleted(exerciseIdx, setIdx)}
                                        className={`p-2 rounded-xl transition-all ${
                                          set.completed 
                                            ? 'bg-emerald-500 text-slate-950 font-black scale-105 shadow-md shadow-emerald-500/20' 
                                            : 'bg-slate-850 hover:bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}
                                      >
                                        <Check className="h-4 w-4 stroke-[3px]" />
                                      </button>
                                    </div>

                                  </div>
                                ))}
                              </div>

                              {/* Row action modifier */}
                              <div className="mt-4 pt-4 border-t border-slate-850 flex items-center justify-between">
                                <button
                                  onClick={() => addSetToExercise(exerciseIdx)}
                                  className="text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                                >
                                  <PlusCircle className="h-4 w-4" /> Add Set Record
                                </button>
                              </div>

                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Complete / Cancel footer commands */}
                  <div className="bg-slate-900 border border-slate-900 rounded-3xl p-5 flex items-center justify-between gap-4">
                    <button
                      onClick={cancelWorkout}
                      className="px-4 py-2.5 bg-slate-950 hover:bg-rose-950 hover:text-rose-200 hover:border-rose-900 border border-slate-850 rounded-xl text-xs font-bold text-slate-400 transition-all"
                    >
                      Discard Session
                    </button>

                    <button
                      onClick={() => setShowEndWorkoutModal(true)}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/10 transition-colors"
                    >
                      <Check className="h-4 w-4 stroke-[2.5px]" /> Log Finished Session
                    </button>
                  </div>

                </div>

                {/* Sidebar chooser column */}
                <div className="bg-slate-900 border border-slate-900 rounded-3xl p-5 flex flex-col h-[650px] sticky top-20 overflow-hidden">
                  <div className="mb-4">
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Search className="h-4.5 w-4.5 text-emerald-400" /> Choose Movement Path
                    </h3>
                    <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">Search muscle segments and inject into current tracking cards</p>
                  </div>

                  {/* Search filters inside sidebar choose */}
                  <div className="space-y-2 mb-4">
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Search chest, arms, legs..."
                        value={exerciseSearch}
                        onChange={(e) => setExerciseSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 outline-none pl-9 pr-4 py-2 rounded-xl text-xs text-slate-300"
                      />
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                    </div>

                    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                      {['All', 'Chest', 'Legs', 'Back', 'Shoulders'].map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setExerciseFilterCategory(cat)}
                          className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase transition-all flex-shrink-0 ${
                            exerciseFilterCategory === cat 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-extrabold' 
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scoll choices */}
                  <div className="flex-grow overflow-y-auto space-y-2 pr-1">
                    {filteredExercises.map(ex => (
                      <div 
                        key={ex.id}
                        onClick={() => addExerciseToActiveWorkout(ex)}
                        className="group flex items-center justify-between p-3 bg-slate-955 border border-slate-850 hover:border-slate-750 hover:bg-slate-950/60 rounded-xl cursor-pointer transition-all"
                      >
                        <div className="max-w-[80%]">
                          <h4 className="font-extrabold text-xs text-slate-200 group-hover:text-emerald-400 transition-all truncate">{ex.name}</h4>
                          <span className="text-[9px] text-slate-500 font-bold uppercase block mt-0.5">{ex.category} · {ex.equipment}</span>
                        </div>

                        <button className="p-1.5 bg-slate-900 group-hover:bg-emerald-500 group-hover:text-slate-950 text-slate-400 rounded-lg transition-colors">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setShowAddExerciseModal(true)}
                    className="mt-4 w-full bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-slate-200 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <PlusSquare className="h-4 w-4" /> Custom Exercise Builder
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

        {/* Exercises Library Database Tab */}
        {activeTab === 'exercises' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
              <div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider">
                  Universal Movement Dictionary
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Exercise Library & Spec Sheets</h2>
                <p className="text-slate-500 text-sm mt-1">Direct athletic instructions, Unsplash visuals, and tempo schedules</p>
              </div>

              <button 
                onClick={() => setShowAddExerciseModal(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/10 shadow"
              >
                <Plus className="h-4 w-4" /> Build Custom Muscle Spec
              </button>
            </div>

            {/* Catalog Database search filters */}
            <div className="bg-slate-900 border border-slate-900 rounded-3xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:max-w-md">
                <input 
                  type="text"
                  placeholder="Filter by muscle or movement names..."
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 outline-none pl-10 pr-4 py-2.5 rounded-xl text-xs text-slate-200"
                />
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              </div>

              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                {['All', 'Chest', 'Legs', 'Back', 'Shoulders', 'Core'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setExerciseFilterCategory(cat)}
                    className={`px-4 py-2 text-[10px] font-bold rounded-xl uppercase tracking-wider border transition-all ${
                      exerciseFilterCategory === cat 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-extrabold' 
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Matrix database grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map(ex => (
                <div 
                  key={ex.id}
                  className="bg-slate-900 border border-slate-900 rounded-3xl p-5 hover:border-slate-800 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
                      <img 
                        src={ex.photoUrl} 
                        alt={ex.name} 
                        className="w-full h-full object-cover filter brightness-75 hover:scale-105 transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                      <span className="absolute top-2.5 left-2.5 bg-emerald-500 text-slate-950 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                        {ex.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white leading-tight">{ex.name}</h3>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1 block">
                      Target Equipment Setup: <span className="text-slate-300">{ex.equipment}</span>
                    </span>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed line-clamp-3">{ex.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between text-xs">
                    <button 
                      onClick={() => setSelectedSpecExercise(ex)}
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 text-[11px]"
                    >
                      <Info className="h-4 w-4" /> View Form Spec Sheets
                    </button>

                    {activeSession && (
                      <button 
                        onClick={() => addExerciseToActiveWorkout(ex)}
                        className="text-blue-400 hover:text-blue-300 font-extrabold flex items-center gap-1 text-[11px]"
                      >
                        Add to Lift +
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Analytics Insights Dashboard */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            <div className="border-b border-slate-900 pb-5">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
                Telemetry Diagnostics
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">Advanced Performance Analytics</h2>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Biostat correlation models monitoring mechanical tonnage progression and skeletal physical mass.
              </p>
            </div>

            {/* Recharts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Scale progress line chart */}
              <div className="bg-slate-900 border border-slate-900 rounded-3xl p-6 shadow-xl space-y-4">
                <div>
                  <h3 className="text-base font-black text-white">Bodyweight Scale History</h3>
                  <p className="text-slate-500 text-xs">Chronological timeline of checked dry morning mass</p>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={biometrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                        labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}
                        itemStyle={{ color: '#10b981', fontSize: '11px' }}
                      />
                      <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* mechanical volume loads chart */}
              <div className="bg-slate-900 border border-slate-900 rounded-3xl p-6 shadow-xl space-y-4">
                <div>
                  <h3 className="text-base font-black text-white">Lifting Volume per Completed Session</h3>
                  <p className="text-slate-500 text-xs">Tonnage calculated from registered completed sets (weight * reps)</p>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[...workoutHistory].reverse()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                        labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}
                        itemStyle={{ color: '#3b82f6', fontSize: '11px' }}
                      />
                      <Line type="monotone" dataKey="totalVolume" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* History grid Table lists */}
            <div className="bg-slate-900 border border-slate-900 rounded-3xl p-6">
              <h3 className="text-lg font-black text-white">Scale Log Archives</h3>
              <p className="text-slate-500 text-xs mt-0.5 mb-6">Historical index logs of weight variables</p>

              <div className="overflow-x-auto rounded-xl">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 text-[10px] uppercase font-bold tracking-widest bg-slate-950/40">
                      <th className="py-3 px-4">Checked Date</th>
                      <th className="py-3 px-4">Register Body Mass</th>
                      <th className="py-3 px-4">Target Lipid Fat %</th>
                      <th className="py-3 px-4">Telemetry Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-slate-300">
                    {biometrics.map((entry, index) => (
                      <tr key={index} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-3 px-4 font-bold">{entry.date}</td>
                        <td className="py-3 px-4 font-mono font-extrabold text-white">{entry.weight} lbs</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{entry.bodyFat ? `${entry.bodyFat}%` : '--'}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase rounded-full">
                            Synced ✓
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* CREATE SPECIFICATION EXERCISE MODAL */}
      {showAddExerciseModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowAddExerciseModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-black text-white flex items-center gap-2 mb-2">
              <Dumbbell className="h-5 w-5 text-emerald-400 animate-pulse" /> Build Custom Muscle Spec
            </h3>
            <p className="text-slate-500 text-xs mb-6">Create customized athletic parameters to track mechanics in real-time logs.</p>

            <form onSubmit={handleCreateExercise} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Exercise System Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Bulgarian Split Squat"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-805 outline-none focus:border-emerald-400 p-3 rounded-xl text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Muscle Division</label>
                  <select
                    value={newExercise.category}
                    onChange={(e) => setNewExercise({...newExercise, category: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-805 outline-none focus:border-emerald-400 p-3 rounded-xl text-xs text-white"
                  >
                    {['Chest', 'Legs', 'Back', 'Shoulders', 'Arms', 'Core'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Primary Gear</label>
                  <select
                    value={newExercise.equipment}
                    onChange={(e) => setNewExercise({...newExercise, equipment: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-805 outline-none focus:border-emerald-400 p-3 rounded-xl text-xs text-white"
                  >
                    {['Barbell', 'Dumbbell', 'Machine', 'Cable Machine', 'Bodyweight', 'Kettlebell'].map(eq => (
                      <option key={eq} value={eq}>{eq}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Physiological Guide Description</label>
                <textarea 
                  rows={2}
                  placeholder="Explain baseline path, hand stance, and thoracic positions..."
                  value={newExercise.description}
                  onChange={(e) => setNewExercise({...newExercise, description: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-805 outline-none focus:border-emerald-400 p-3 rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Motivational Psychological Cue</label>
                <input 
                  type="text"
                  placeholder="e.g. Explode off the heels, push the planet down!"
                  value={newExercise.motivationQuote}
                  onChange={(e) => setNewExercise({...newExercise, motivationQuote: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-805 outline-none focus:border-emerald-400 p-3 rounded-xl text-xs text-white animate-pulse"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-850">
                <button 
                  type="button"
                  onClick={() => setShowAddExerciseModal(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-400 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/10"
                >
                  Create Spec File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION END WORKOUT MODAL */}
      {showEndWorkoutModal && activeSession && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowEndWorkoutModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-black text-white flex items-center gap-2 mb-2">
              <Check className="h-5 w-5 text-emerald-400" /> Log Session Metrics?
            </h3>
            <p className="text-slate-500 text-xs mb-6">Are you ready to finalise this active workout to the historical log archives? This integrates total completed weights and reps stats.</p>

            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 mb-6 space-y-2 font-sans text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Rostered Movements:</span>
                <span className="font-bold text-white">{activeSession.exercises.length}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Rostered Sets:</span>
                <span className="font-bold text-white">
                  {activeSession.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)} sets
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Completed Checked Sets:</span>
                <span className="font-bold text-emerald-400">
                  {activeSession.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0)} complete
                </span>
              </div>
              
              <div className="flex justify-between items-center border-t border-slate-850 pt-2 text-slate-300">
                <span className="font-bold">Estimated Mechanical Load:</span>
                <span className="font-black text-emerald-400">{calculateSessionVolume(activeSession).toLocaleString()} lbs</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 text-xs">
              <button 
                type="button"
                onClick={() => setShowEndWorkoutModal(false)}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-400 rounded-xl"
              >
                Go Back
              </button>
              <button 
                type="button"
                onClick={finishWorkout}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/10"
              >
                Log Lift Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Perfect Form & Motivation deep spec view overlay */}
      <ExerciseDetailDrawer 
        exercise={selectedSpecExercise}
        onClose={() => setSelectedSpecExercise(null)}
        onAddToSession={(ex) => addExerciseToActiveWorkout(ex)}
        isSessionActive={!!activeSession}
        triggerToast={triggerToast}
      />

      {/* Mobile-Friendly / Sticky Footer Tablet Navigator Bar */}
      <footer className="bg-slate-900 border-t border-slate-900 sticky bottom-0 z-40">
        <div className="max-w-7xl mx-auto px-4 flex justify-around select-none">
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-3 gap-1 flex-1 text-xs font-black uppercase text-[10px] ${
              activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Activity className="h-5 w-5" />
            <span>Dashboard</span>
          </button>

          <button 
            onClick={() => setActiveTab('workout')}
            className={`flex flex-col items-center justify-center py-3 gap-1 flex-1 text-xs font-black uppercase text-[10px] relative ${
              activeTab === 'workout' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {activeSession && (
              <span className="absolute top-2.5 right-[31%] sm:right-[41%] h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
            )}
            <Dumbbell className="h-5 w-5" />
            <span>Active Term</span>
          </button>

          <button 
            onClick={() => setActiveTab('coach')}
            className={`flex flex-col items-center justify-center py-3 gap-1 flex-1 text-xs font-black uppercase text-[10px] ${
              activeTab === 'coach' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Compass className="h-5 w-5" />
            <span>Form & Vibe</span>
          </button>

          <button 
            onClick={() => setActiveTab('exercises')}
            className={`flex flex-col items-center justify-center py-3 gap-1 flex-1 text-xs font-black uppercase text-[10px] ${
              activeTab === 'exercises' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <PlusSquare className="h-5 w-5" />
            <span>Catalog</span>
          </button>

          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center justify-center py-3 gap-1 flex-1 text-xs font-black uppercase text-[10px] ${
              activeTab === 'analytics' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            <span>Trends</span>
          </button>

        </div>
      </footer>

    </div>
  );
}
