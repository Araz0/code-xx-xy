import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSupabase } from './useSupabase'
import { subscribeToQuizResultsUpdates } from './quizResultsSync'
import i18n from '../i18n.ts'

type QuizResultRow = {
  id: string
  created_at: string
  language: string | null
  answers: number[]
}

export function usePresenterResults() {
  const { fetchQuizResults, isReady } = useSupabase()
  const [rows, setRows] = useState<QuizResultRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshResults = useCallback(async () => {
    if (!isReady) {
      setRows([])
      setError(i18n.t('errors.supabaseNotConfigured'))
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error: fetchError } = await fetchQuizResults({ limit: 250 })

    if (fetchError) {
      setRows([])
      setError(
        i18n.t('errors.fetchResultsFailed', { message: fetchError.message }),
      )
      setLoading(false)
      return
    }

    setRows((data ?? []) as QuizResultRow[])
    setError(null)
    setLoading(false)
  }, [fetchQuizResults, isReady])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshResults()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [refreshResults])

  useEffect(() => {
    return subscribeToQuizResultsUpdates(() => {
      void refreshResults()
    })
  }, [refreshResults])

  const resultsSets = useMemo(
    () =>
      rows
        .slice()
        .reverse()
        .map((row) => row.answers),
    [rows],
  )

  return {
    loading,
    error,
    resultsSets,
    refreshResults,
  }
}
