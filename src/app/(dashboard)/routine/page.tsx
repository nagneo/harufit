import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import RoutineListClient from '@/components/routine/RoutineListClient'
import type { Routine } from '@/types/routine'

export default async function RoutinePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let routines: Routine[] = []
  if (user) {
    const { data } = await supabase
      .from('routines')
      .select('*, exercises:routine_exercises(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    routines = (data as Routine[]) ?? []
  }

  return (
    <>
      <Header title="내 루틴" />
      <RoutineListClient routines={routines} />
    </>
  )
}
