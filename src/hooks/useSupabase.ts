import { useCallback, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'

type SubmitQuizResultInput = {
  answers: number[]
  language?: string
}

type FetchQuizResultsInput = {
  limit?: number
}

type QuizResultRow = {
  id: string
  created_at: string
  language: string | null
  answers: number[]
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const SUPABASE_TABLE = import.meta.env.VITE_SUPABASE_TABLE

export function useSupabase() {
  const client = useMemo(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }, [])

  const isReady = Boolean(client && SUPABASE_TABLE)

  const submitQuizResults = useCallback(
    async ({ answers, language }: SubmitQuizResultInput) => {
      if (!client || !SUPABASE_TABLE) {
        return {
          data: null,
          error: new Error('Supabase is not configured.'),
        }
      }

      return client.from(SUPABASE_TABLE).insert({
        answers,
        language: language ?? null,
      })
    },
    [client],
  )

  const fetchQuizResults = useCallback(
    async ({ limit = 250 }: FetchQuizResultsInput = {}) => {
      if (!client || !SUPABASE_TABLE) {
        return {
          data: [] as QuizResultRow[],
          error: new Error('Supabase is not configured.'),
        }
      }

      const query = client
        .from(SUPABASE_TABLE)
        .select('id, created_at, language, answers')
        .order('created_at', { ascending: true })
        .limit(limit)

      return query
    },
    [client],
  )

  return {
    client,
    isReady,
    submitQuizResults,
    fetchQuizResults,
  }
}
