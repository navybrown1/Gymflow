import { ExerciseFormDetails } from '../types';

export const EXERCISES_LIBRARY: ExerciseFormDetails[] = [
  {
    id: 1,
    name: 'Barbell Bench Press',
    category: 'Chest',
    equipment: 'Barbell',
    trackingType: 'weight_reps',
    description: 'Lay flat on a bench, retract your scapula, grip the barbell slightly wider than shoulder width, lower controlled to mid-chest, and drive up with chest extension.',
    photoUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=650',
    motivationQuote: 'Your mind sets the limit. Control the descent, dominate the drive. You are stronger than your doubts.',
    mindMuscleFocus: 'Focus on retracting your shoulder blades and squeezing your chest fibers together at the top of the lift, rather than just pushing with your triceps.',
    correctFormCues: [
      'Retract and depress shoulder blades flat against the bench pad',
      'Keep feet flat on the floor to generate solid leg drive',
      'Lower the bar in an arc pathway to lower/mid sternum',
      'Keep elbows tucked at a 45-degree angle to safeguard rotator cuffs'
    ],
    commonMistakes: [
      'Flaring elbows wide (90-degrees), placing high stress on anterior delts',
      'Bouncing or slamming the barbell off the chest to create momentum',
      'Lifting your hips and glutes off the bench, which arches your spine dangerously'
    ],
    mechanicsType: 'Compound',
    tempo: '3-1-1-0',
    tempoSeconds: { eccentric: 3, pauseMax: 1, concentric: 1, pauseMin: 0 }
  },
  {
    id: 2,
    name: 'Incline Dumbbell Fly',
    category: 'Chest',
    equipment: 'Dumbbell',
    trackingType: 'weight_reps',
    description: 'Maintain a slight bend at the elbows, hinge at the shoulders to lower dumbbells outwards on a 30-45 degree incline bench, and squeeze at the peak.',
    photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=650',
    motivationQuote: 'Hypertrophy is born in the deep stretch. Embrace it, command the volume with strict posture.',
    mindMuscleFocus: 'Imagine wrapping your arms around a massive oak tree. Keep the horizontal tension high, and do not let the dumbbells touch at the top.',
    correctFormCues: [
      'Pin shoulders back on the incline bench pad throughout the layout',
      'Maintain a consistent 15-to-20 degree bend in your elbows',
      'Lower dumbbells slowly until a comfortable stretch is felt in the outer chest',
      'Bring weights together with a sweeping hug-like motion to maintain tension'
    ],
    commonMistakes: [
      'Turning the fly into a press by excessively bending the elbows on the way down',
      'Letting dumbbells touch or clank at the top, losing chest tension',
      'Dropping the shoulders forward at the bottom position'
    ],
    mechanicsType: 'Isolation',
    tempo: '3-2-1-1',
    tempoSeconds: { eccentric: 3, pauseMax: 2, concentric: 1, pauseMin: 1 }
  },
  {
    id: 3,
    name: 'Barbell Back Squat',
    category: 'Legs',
    equipment: 'Barbell',
    trackingType: 'weight_reps',
    description: 'Rest the barbell on your traps or rear delts, hinge your hips, and squat down keeping your knees aligned with your toes, then push through your mid-foot to stand.',
    photoUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=650',
    motivationQuote: 'The squat is the perfect metaphor for life: it is about getting back up when something heavy is trying to hold you down.',
    mindMuscleFocus: 'Push the floor away through your heels and mid-foot. Think of your hips driving straight up in a vertical line.',
    correctFormCues: [
      'Create a tight shelf for the bar on your upper traps or rear delts',
      'Pull down on the bar to engage the lats and secure upper back tightness',
      'Push knees outward in line with middle toes as you descend',
      'Squat until thighs are parallel to the floor or slightly below'
    ],
    commonMistakes: [
      'Allowing knees to cave inward (valgus collapse) during drive phase',
      'Heels lifting off the ground, shifting load onto the toes and knees',
      'Round lumbar spine (butt wink) at the bottom of the squat'
    ],
    mechanicsType: 'Compound',
    tempo: '3-1-1-0',
    tempoSeconds: { eccentric: 3, pauseMax: 1, concentric: 1, pauseMin: 0 }
  },
  {
    id: 4,
    name: 'Romanian Deadlift',
    category: 'Legs',
    equipment: 'Barbell',
    trackingType: 'weight_reps',
    description: 'Establish a neutral lumbar spine, hinge backward through the hips keeping the bar in contact with your legs, and drive forward with the hamstrings and glutes.',
    photoUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=650',
    motivationQuote: 'Hinge back into tension. Power is loaded in the posterior chain.',
    mindMuscleFocus: 'Don’t think about lowering the bar down. Think about pushing your butt back toward an imaginary wall behind you.',
    correctFormCues: [
      'Maintain a neutral spine and gaze slightly forward, not straight up',
      'Keep the bar shaved tight against your thighs and shins throughout the lift',
      'Hinge at the hips as far as your hamstring flexibility allows without back flexion',
      'Squeeze the glutes hard to bring the hips back to start position'
    ],
    commonMistakes: [
      'Rounding the lower back to reach lower or reach the floor',
      'Letting the bar drift forward away from the body, strains lower back',
      'Simply bending at the knees instead of hinging the hips back'
    ],
    mechanicsType: 'Compound',
    tempo: '3-0-1-1',
    tempoSeconds: { eccentric: 3, pauseMax: 0, concentric: 1, pauseMin: 1 }
  },
  {
    id: 5,
    name: 'Lat Pulldown',
    category: 'Back',
    equipment: 'Cable Machine',
    trackingType: 'weight_reps',
    description: 'Secure your knees under the pads, slightly lean back, pull the bar down toward your upper chest by driving your elbows down and back.',
    photoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=650',
    motivationQuote: 'Build a back that can carry your ambitions. Pull with intense presence.',
    mindMuscleFocus: 'Imagine your hands as simple hooks. Pull entirely with your elbows to isolate the lats rather than pulling with your biceps.',
    correctFormCues: [
      'Slightly lean back about 10-15 degrees from your hips',
      'Drive elbows down towards your side-ribs',
      'Squeeze the shoulder blades down and back at the bottom contraction',
      'Control the ascent (eccentric) to fully stretch the lats at the top'
    ],
    commonMistakes: [
      'Pulling the bar down behind the neck, causing shoulder stress',
      'Using excessive body momentum or swinging to pull the weight down',
      'Letting the shoulders shrug and roll forward at the bottom'
    ],
    mechanicsType: 'Compound',
    tempo: '2-1-1-1',
    tempoSeconds: { eccentric: 2, pauseMax: 1, concentric: 1, pauseMin: 1 }
  },
  {
    id: 6,
    name: 'Bent Over Row',
    category: 'Back',
    equipment: 'Barbell',
    trackingType: 'weight_reps',
    description: 'Lean torso forward, hinge hips, row barbell to lower chest/abdominal line using lats and rhomboids.',
    photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=650',
    motivationQuote: 'A thick back is built row by row. Hold your posture and execute.',
    mindMuscleFocus: 'Drive your elbows back behind your thoracic spine, squeezing your shoulder blades together.',
    correctFormCues: [
      'Lower torso to roughly 45 degrees, maintaining neutral lumbar curvature',
      'Pull the bar upward towards your lower abdomen or belly button',
      'Lead the movement with your elbows, retracting your ribcage',
      'Extend arms fully at the bottom to achieve full back elongation'
    ],
    commonMistakes: [
      'Standing up too straight to use more weight, transferring load to superior traps',
      'Jerking or using leg bounce to yank the weight upwards',
      'Rounding the t-spine under heavy mechanical pressure'
    ],
    mechanicsType: 'Compound',
    tempo: '3-0-1-1',
    tempoSeconds: { eccentric: 3, pauseMax: 0, concentric: 1, pauseMin: 1 }
  },
  {
    id: 7,
    name: 'Seated Dumbbell Shoulder Press',
    category: 'Shoulders',
    equipment: 'Dumbbell',
    trackingType: 'weight_reps',
    description: 'Press dumbbells vertically above shoulders from seated high-backed position, locking out briefly at the top.',
    photoUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=650',
    motivationQuote: 'Stand tall, press strong. Build boulders that frame your athletic shape.',
    mindMuscleFocus: 'Push straight up towards the ceiling, concentrating on the contraction of the lateral and anterior deltoid fibers.',
    correctFormCues: [
      'Sit fully back in the seat with chest proud and shoulders pulled back',
      'Tuck elbows slightly inward at a 30-degree angle from the flat plane',
      'Brace core firmly and avoid hyperextending your lumbar spine',
      'Lower dumbbells controlled until they are level with your ears'
    ],
    commonMistakes: [
      'Excessively arching the back, shifting the load to upper pectorals',
      'Clanking the dumbbells violently together at the top of the lift',
      'Using partial range of motion, stopping far above shoulder line'
    ],
    mechanicsType: 'Compound',
    tempo: '3-1-1-0',
    tempoSeconds: { eccentric: 3, pauseMax: 1, concentric: 1, pauseMin: 0 }
  },
  {
    id: 8,
    name: 'Plank Hold',
    category: 'Core',
    equipment: 'Bodyweight',
    trackingType: 'duration',
    description: 'Core stabilization exercise holding a static elbow-and-toe bridge with solid transverse abdominal engagement.',
    photoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=650',
    motivationQuote: 'True power is stability. Hold your ground. Under stress is where character is built.',
    mindMuscleFocus: 'Actively hollow your stomach and pull your belly button towards your spine while squeezing your quadriceps.',
    correctFormCues: [
      'Place elbows directly underneath your shoulders to share support',
      'Form a straight, unwavering line from your ears down to your heels',
      'Squeeze glutes and quadriceps intensely to lock in skeletal alignment',
      'Push away from the floor through your shoulder blades to stay active'
    ],
    commonMistakes: [
      'Allowing hips to sag towards the floor, hyperextending the lower back',
      'Piking the butt high in the air to offload abdominal demand',
      'Holding your breath, which raises blood pressure and fatigues muscles'
    ],
    mechanicsType: 'Isolation',
    tempo: '0-0-1-0',
    tempoSeconds: { eccentric: 0, pauseMax: 0, concentric: 1, pauseMin: 0 }
  }
];

export const MOTIVATIONAL_QUOTES = [
  { text: "Pain is temporary. It may last a minute, or an hour, or a day, or a year, but eventually it will subside. If I quit, however, it lasts forever.", author: "Lance Armstrong" },
  { text: "Your body can stand almost anything. It’s your mind that you have to convince.", author: "Unknown" },
  { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "What hurts today makes you stronger tomorrow.", author: "Jay Cutler" },
  { text: "Doubt is only removed by action. If you’re not working, that’s where doubt creeps in.", author: "Conor McGregor" },
  { text: "The clock is ticking. Are you becoming the person you want to be?", author: "Jocko Willink" }
];
