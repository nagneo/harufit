import { createClient } from './server'
import type { Routine, RoutineExercise } from '@/types/routine'

export async function getRoutinesByUser(userId: string): Promise<Routine[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('routines')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getRoutineWithExercises(routineId: string): Promise<Routine | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('routines')
    .select('*, exercises:routine_exercises(*)')
    .eq('id', routineId)
    .order('sort_order', { referencedTable: 'routine_exercises', ascending: true })
    .single()
  if (error) return null
  return data as Routine
}

export async function createRoutine(data: { user_id: string; name: string }): Promise<Routine> {
  const supabase = await createClient()
  const { data: routine, error } = await supabase
    .from('routines')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return routine
}

export async function createRoutineExercises(
  exercises: Omit<RoutineExercise, 'id'>[]
): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('routine_exercises').insert(exercises)
  if (error) throw error
}

export async function updateRoutine(
  id: string,
  data: Partial<Pick<Routine, 'name' | 'is_active'>>
): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('routines').update(data).eq('id', id)
  if (error) throw error
}

export async function setActiveRoutine(userId: string, routineId: string): Promise<void> {
  const supabase = await createClient()
  const { error: e1 } = await supabase
    .from('routines')
    .update({ is_active: false })
    .eq('user_id', userId)
  if (e1) throw e1
  const { error: e2 } = await supabase
    .from('routines')
    .update({ is_active: true })
    .eq('id', routineId)
  if (e2) throw e2
}

export async function deleteRoutine(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('routines').delete().eq('id', id)
  if (error) throw error
}

export async function upsertRoutineExercises(
  routineId: string,
  exercises: Array<{
    name: string
    sets: number | null
    reps: number | null
    weight: number | null
    duration: string | null
    sort_order: number
  }>
): Promise<void> {
  const supabase = await createClient()
  const { error: delError } = await supabase
    .from('routine_exercises')
    .delete()
    .eq('routine_id', routineId)
  if (delError) throw delError
  if (exercises.length === 0) return
  const { error } = await supabase
    .from('routine_exercises')
    .insert(exercises.map((ex) => ({ ...ex, routine_id: routineId })))
  if (error) throw error
}
