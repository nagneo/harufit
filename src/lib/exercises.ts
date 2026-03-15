export type MuscleGroup = '가슴' | '등' | '어깨' | '팔' | '하체' | '코어' | '유산소'

export type Equipment = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'other'

export type CardioField = 'duration' | 'speed' | 'incline' | 'resistance' | 'distance'

export const CARDIO_FIELD_META: Record<CardioField, { label: string; unit: string; placeholder: string }> = {
  duration:   { label: '시간',  unit: '분',   placeholder: '30' },
  speed:      { label: '속도',  unit: 'km/h', placeholder: '8.0' },
  incline:    { label: '경사',  unit: '%',    placeholder: '3' },
  resistance: { label: '저항',  unit: '단계', placeholder: '7' },
  distance:   { label: '거리',  unit: 'm',    placeholder: '2000' },
}

export type ExerciseDefinition = {
  id: string
  name: string
  nameEn: string
  muscleGroup: MuscleGroup
  equipment: Equipment
  exerciseType?: 'strength' | 'cardio'  // 미지정 시 'strength'로 처리
  cardioFields?: CardioField[]
  defaultSets: number
  defaultReps: number
  defaultWeight: number | null
}

export const MUSCLE_GROUPS: MuscleGroup[] = [
  '가슴', '등', '어깨', '팔', '하체', '코어', '유산소',
]

export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
  // 가슴
  { id: 'bench-press', name: '벤치프레스', nameEn: 'Bench Press', muscleGroup: '가슴', equipment: 'barbell', defaultSets: 4, defaultReps: 8, defaultWeight: 60 },
  { id: 'incline-bench-press', name: '인클라인 벤치프레스', nameEn: 'Incline Bench Press', muscleGroup: '가슴', equipment: 'barbell', defaultSets: 3, defaultReps: 10, defaultWeight: 50 },
  { id: 'decline-bench-press', name: '디클라인 벤치프레스', nameEn: 'Decline Bench Press', muscleGroup: '가슴', equipment: 'barbell', defaultSets: 3, defaultReps: 10, defaultWeight: 55 },
  { id: 'dumbbell-press', name: '덤벨 벤치프레스', nameEn: 'Dumbbell Bench Press', muscleGroup: '가슴', equipment: 'dumbbell', defaultSets: 3, defaultReps: 12, defaultWeight: 22 },
  { id: 'incline-dumbbell-press', name: '인클라인 덤벨프레스', nameEn: 'Incline Dumbbell Press', muscleGroup: '가슴', equipment: 'dumbbell', defaultSets: 3, defaultReps: 12, defaultWeight: 18 },
  { id: 'cable-crossover', name: '케이블 크로스오버', nameEn: 'Cable Crossover', muscleGroup: '가슴', equipment: 'cable', defaultSets: 3, defaultReps: 15, defaultWeight: 15 },
  { id: 'chest-fly', name: '체스트 플라이', nameEn: 'Chest Fly', muscleGroup: '가슴', equipment: 'dumbbell', defaultSets: 3, defaultReps: 12, defaultWeight: 14 },
  { id: 'pushup', name: '푸쉬업', nameEn: 'Push-up', muscleGroup: '가슴', equipment: 'bodyweight', defaultSets: 3, defaultReps: 15, defaultWeight: null },
  { id: 'dips', name: '딥스', nameEn: 'Dips', muscleGroup: '가슴', equipment: 'bodyweight', defaultSets: 3, defaultReps: 10, defaultWeight: null },

  // 등
  { id: 'lat-pulldown', name: '랫 풀다운', nameEn: 'Lat Pulldown', muscleGroup: '등', equipment: 'cable', defaultSets: 4, defaultReps: 10, defaultWeight: 50 },
  { id: 'behind-neck-lat-pulldown', name: '비하인드 넥 랫 풀다운', nameEn: 'Behind Neck Lat Pulldown', muscleGroup: '등', equipment: 'cable', defaultSets: 3, defaultReps: 10, defaultWeight: 45 },
  { id: 'barbell-row', name: '바벨 로우', nameEn: 'Barbell Row', muscleGroup: '등', equipment: 'barbell', defaultSets: 4, defaultReps: 8, defaultWeight: 60 },
  { id: 'deadlift', name: '데드리프트', nameEn: 'Deadlift', muscleGroup: '등', equipment: 'barbell', defaultSets: 3, defaultReps: 5, defaultWeight: 100 },
  { id: 'pullup', name: '풀업', nameEn: 'Pull-up', muscleGroup: '등', equipment: 'bodyweight', defaultSets: 3, defaultReps: 8, defaultWeight: null },
  { id: 'seated-cable-row', name: '시티드 케이블 로우', nameEn: 'Seated Cable Row', muscleGroup: '등', equipment: 'cable', defaultSets: 3, defaultReps: 12, defaultWeight: 45 },
  { id: 'dumbbell-row', name: '원암 덤벨 로우', nameEn: 'One-Arm Dumbbell Row', muscleGroup: '등', equipment: 'dumbbell', defaultSets: 3, defaultReps: 12, defaultWeight: 24 },
  { id: 'face-pull', name: '페이스 풀', nameEn: 'Face Pull', muscleGroup: '등', equipment: 'cable', defaultSets: 3, defaultReps: 15, defaultWeight: 20 },
  { id: 'hyperextension', name: '하이퍼익스텐션', nameEn: 'Hyperextension', muscleGroup: '등', equipment: 'machine', defaultSets: 3, defaultReps: 15, defaultWeight: null },

  // 어깨
  { id: 'overhead-press', name: '오버헤드 프레스', nameEn: 'Overhead Press', muscleGroup: '어깨', equipment: 'barbell', defaultSets: 4, defaultReps: 8, defaultWeight: 40 },
  { id: 'dumbbell-shoulder-press', name: '덤벨 숄더프레스', nameEn: 'Dumbbell Shoulder Press', muscleGroup: '어깨', equipment: 'dumbbell', defaultSets: 3, defaultReps: 12, defaultWeight: 16 },
  { id: 'lateral-raise', name: '사이드 레터럴 레이즈', nameEn: 'Lateral Raise', muscleGroup: '어깨', equipment: 'dumbbell', defaultSets: 3, defaultReps: 15, defaultWeight: 8 },
  { id: 'front-raise', name: '프론트 레이즈', nameEn: 'Front Raise', muscleGroup: '어깨', equipment: 'dumbbell', defaultSets: 3, defaultReps: 12, defaultWeight: 8 },
  { id: 'rear-delt-fly', name: '리어 델트 플라이', nameEn: 'Rear Delt Fly', muscleGroup: '어깨', equipment: 'dumbbell', defaultSets: 3, defaultReps: 15, defaultWeight: 8 },
  { id: 'arnold-press', name: '아놀드 프레스', nameEn: 'Arnold Press', muscleGroup: '어깨', equipment: 'dumbbell', defaultSets: 3, defaultReps: 12, defaultWeight: 14 },

  // 팔
  { id: 'barbell-curl', name: '바벨 컬', nameEn: 'Barbell Curl', muscleGroup: '팔', equipment: 'barbell', defaultSets: 3, defaultReps: 12, defaultWeight: 30 },
  { id: 'dumbbell-curl', name: '덤벨 컬', nameEn: 'Dumbbell Curl', muscleGroup: '팔', equipment: 'dumbbell', defaultSets: 3, defaultReps: 12, defaultWeight: 12 },
  { id: 'hammer-curl', name: '해머 컬', nameEn: 'Hammer Curl', muscleGroup: '팔', equipment: 'dumbbell', defaultSets: 3, defaultReps: 12, defaultWeight: 12 },
  { id: 'triceps-pushdown', name: '트라이셉스 푸쉬다운', nameEn: 'Triceps Pushdown', muscleGroup: '팔', equipment: 'cable', defaultSets: 3, defaultReps: 15, defaultWeight: 20 },
  { id: 'overhead-triceps-extension', name: '오버헤드 트라이셉스 익스텐션', nameEn: 'Overhead Triceps Extension', muscleGroup: '팔', equipment: 'dumbbell', defaultSets: 3, defaultReps: 12, defaultWeight: 16 },
  { id: 'skull-crusher', name: '스컬 크러셔', nameEn: 'Skull Crusher', muscleGroup: '팔', equipment: 'barbell', defaultSets: 3, defaultReps: 12, defaultWeight: 25 },

  // 하체
  { id: 'squat', name: '스쿼트', nameEn: 'Squat', muscleGroup: '하체', equipment: 'barbell', defaultSets: 4, defaultReps: 6, defaultWeight: 80 },
  { id: 'split-squat', name: '스플릿 스쿼트', nameEn: 'Split Squat', muscleGroup: '하체', equipment: 'bodyweight', defaultSets: 3, defaultReps: 10, defaultWeight: null },
  { id: 'bulgarian-split-squat', name: '불가리안 스플릿 스쿼트', nameEn: 'Bulgarian Split Squat', muscleGroup: '하체', equipment: 'dumbbell', defaultSets: 3, defaultReps: 10, defaultWeight: 20 },
  { id: 'leg-press', name: '레그 프레스', nameEn: 'Leg Press', muscleGroup: '하체', equipment: 'machine', defaultSets: 4, defaultReps: 10, defaultWeight: 120 },
  { id: 'romanian-deadlift', name: '루마니안 데드리프트', nameEn: 'Romanian Deadlift', muscleGroup: '하체', equipment: 'barbell', defaultSets: 3, defaultReps: 10, defaultWeight: 70 },
  { id: 'leg-curl', name: '레그 컬', nameEn: 'Leg Curl', muscleGroup: '하체', equipment: 'machine', defaultSets: 3, defaultReps: 12, defaultWeight: 40 },
  { id: 'leg-extension', name: '레그 익스텐션', nameEn: 'Leg Extension', muscleGroup: '하체', equipment: 'machine', defaultSets: 3, defaultReps: 12, defaultWeight: 40 },
  { id: 'calf-raise', name: '카프 레이즈', nameEn: 'Calf Raise', muscleGroup: '하체', equipment: 'machine', defaultSets: 4, defaultReps: 15, defaultWeight: 60 },
  { id: 'lunges', name: '런지', nameEn: 'Lunges', muscleGroup: '하체', equipment: 'bodyweight', defaultSets: 3, defaultReps: 12, defaultWeight: null },

  // 코어
  { id: 'plank', name: '플랭크', nameEn: 'Plank', muscleGroup: '코어', equipment: 'bodyweight', defaultSets: 3, defaultReps: 1, defaultWeight: null },
  { id: 'crunch', name: '크런치', nameEn: 'Crunch', muscleGroup: '코어', equipment: 'bodyweight', defaultSets: 3, defaultReps: 20, defaultWeight: null },
  { id: 'leg-raise', name: '레그 레이즈', nameEn: 'Leg Raise', muscleGroup: '코어', equipment: 'bodyweight', defaultSets: 3, defaultReps: 15, defaultWeight: null },
  { id: 'russian-twist', name: '러시안 트위스트', nameEn: 'Russian Twist', muscleGroup: '코어', equipment: 'bodyweight', defaultSets: 3, defaultReps: 20, defaultWeight: null },
  { id: 'cable-crunch', name: '케이블 크런치', nameEn: 'Cable Crunch', muscleGroup: '코어', equipment: 'cable', defaultSets: 3, defaultReps: 15, defaultWeight: 25 },
  { id: 'ab-rollout', name: '복근 롤아웃', nameEn: 'Ab Rollout', muscleGroup: '코어', equipment: 'other', defaultSets: 3, defaultReps: 10, defaultWeight: null },

  // 유산소
  { id: 'treadmill', name: '트레드밀', nameEn: 'Treadmill', muscleGroup: '유산소', equipment: 'machine', exerciseType: 'cardio', cardioFields: ['duration', 'speed', 'incline'], defaultSets: 1, defaultReps: 1, defaultWeight: null },
  { id: 'stationary-bike', name: '고정식 자전거', nameEn: 'Stationary Bike', muscleGroup: '유산소', equipment: 'machine', exerciseType: 'cardio', cardioFields: ['duration', 'resistance'], defaultSets: 1, defaultReps: 1, defaultWeight: null },
  { id: 'rowing-machine', name: '로잉 머신', nameEn: 'Rowing Machine', muscleGroup: '유산소', equipment: 'machine', exerciseType: 'cardio', cardioFields: ['duration', 'distance'], defaultSets: 1, defaultReps: 1, defaultWeight: null },
  { id: 'jump-rope', name: '줄넘기', nameEn: 'Jump Rope', muscleGroup: '유산소', equipment: 'other', exerciseType: 'cardio', cardioFields: ['duration'], defaultSets: 1, defaultReps: 1, defaultWeight: null },
]


export function searchExercises(query: string, muscleGroup?: MuscleGroup | null): ExerciseDefinition[] {
  const q = query.toLowerCase().trim()
  return EXERCISE_LIBRARY.filter((ex) => {
    const matchesQuery =
      q === '' ||
      ex.name.includes(q) ||
      ex.nameEn.toLowerCase().includes(q)
    const matchesMuscle = !muscleGroup || ex.muscleGroup === muscleGroup
    return matchesQuery && matchesMuscle
  })
}

export function getExerciseById(id: string): ExerciseDefinition | undefined {
  return EXERCISE_LIBRARY.find((ex) => ex.id === id)
}

export function calcEstimatedMinutes(
  exercises: Array<{ sets: number | null; reps: number | null; exerciseType?: string; extras?: Record<string, string> | null }>
): number {
  const totalSeconds = exercises.reduce((total, ex) => {
    if (ex.exerciseType === 'cardio') {
      return total + (Number(ex.extras?.duration) || 30) * 60
    }
    const sets = ex.sets ?? 3
    const reps = ex.reps ?? 10
    return total + sets * reps * 3 + sets * 60
  }, 0)
  const raw = totalSeconds / 60
  return Math.ceil(raw / 5) * 5
}
