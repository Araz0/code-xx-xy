import type { PrintData } from './types'
import { normalizePrintData } from './printDataUtils'
import type { RawQuestion } from '../../quizStore'

type ResultSet = number[]

type ResultsInput = ResultSet[]

export function buildPrintDataFromResults(
  questions: RawQuestion[],
  results: ResultsInput,
): PrintData {
  const safeResults = results.filter((set) => Array.isArray(set))

  const lines = questions.map((question, index) => {
    const points = safeResults
      .map((set) => set[index])
      .filter((value) => Number.isFinite(value))
      .map((value) => Math.max(0, Math.min(100, Number(value))))

    return {
      line: index + 1,
      correctAnswer: question.answer,
      points,
    }
  })

  return normalizePrintData({ lines })
}
