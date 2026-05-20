export interface SetRecord {
  set_id: number;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exerciseId: number;
  exerciseName: string;
  sets: SetRecord[];
}

export interface WorkoutSession {
  id: string;
  name: string;
  date: string;
  duration: number; // in seconds
  totalVolume: number;
  exercises: WorkoutExercise[];
}

export interface BiometricRecord {
  date: string;
  weight: number;
  bodyFat: number | null;
}

export interface ExerciseFormDetails {
  id: number;
  name: string;
  category: string;
  equipment: string;
  trackingType: string;
  description: string;
  photoUrl: string;
  motivationQuote: string;
  mindMuscleFocus: string;
  correctFormCues: string[];
  commonMistakes: string[];
  mechanicsType: 'Compound' | 'Isolation';
  tempo: string; // e.g. "3-1-1-0"
  tempoSeconds: {
    eccentric: number;
    pauseMax: number;
    concentric: number;
    pauseMin: number;
  };
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}
