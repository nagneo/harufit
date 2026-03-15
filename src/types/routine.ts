export type Routine = {
  id: string
  user_id: string
  name: string
  is_active: boolean
  created_at: string
  exercises?: RoutineExercise[]
}

export type RoutineExercise = {
  id: string
  routine_id: string
  name: string
  sets: number | null
  reps: number | null
  weight: number | null
  duration: string | null
  extras: Record<string, string> | null
  sort_order: number
}

export type RoutineLog = {
  id: string
  user_id: string
  routine_id: string | null
  date: string
  completed_exercises: CompletedExercise[] | null
  created_at: string
}

export type CompletedExercise = {
  name: string
  checked: boolean
  weight_used: number | null
}
