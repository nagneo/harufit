import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import RoutineDetailClient from '@/components/routine/RoutineDetailClient'
import type { Routine } from '@/types/routine'

interface Props {
  params: Promise<{ id: string }>
}

export default async function RoutineDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('routines')
    .select('*, exercises:routine_exercises(*)')
    .eq('id', id)
    .order('sort_order', { referencedTable: 'routine_exercises', ascending: true })
    .single()

  if (!data) notFound()

  const routine = data as Routine

  return (
    <>
      <Header title={routine.name} backHref="/routine" />
      <RoutineDetailClient routine={routine} />
    </>
  )
}
