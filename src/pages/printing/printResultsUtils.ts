import type { GenderLabel, PrintData } from './types'
import { normalizePrintData } from './printDataUtils'
import type { RawQuestion } from '../../quizStore'

type ResultSet = number[]

type ResultsInput = ResultSet[]

export function buildPrintDataFromResults(
  questions: RawQuestion[],
  results: ResultsInput,
): PrintData {
  const safeResults = results.filter((set) => Array.isArray(set))

  const inferTargetGender = (question: RawQuestion): GenderLabel => {
    const explicit = (question as { targetGender?: GenderLabel }).targetGender
    if (explicit === 'men' || explicit === 'women') return explicit

    const title = question.title?.en || ''
    const body = question.question?.en || ''
    const text = `${title} ${body}`.toLowerCase()

    if (text.includes('women') || text.includes('female')) return 'women'
    return 'men'
  }

  let menBiasSum = 0
  let biasCount = 0

  const lines = questions.map((question, index) => {
    const points = safeResults
      .map((set) => set[index])
      .filter((value) => Number.isFinite(value))
      .map((value) => Math.max(0, Math.min(100, Number(value))))

    const userPoint = Number.isFinite(points[0]) ? points[0] : null
    const historicalPoints = points.slice(1)
    const targetGender = inferTargetGender(question)
    const diff = userPoint === null ? null : userPoint - question.answer

    let biasDirection: GenderLabel | null = null
    let menSignedDiff = 0
    if (diff !== null && diff !== 0) {
      if (diff > 0) {
        biasDirection = targetGender
      } else {
        biasDirection = targetGender === 'men' ? 'women' : 'men'
      }
      menSignedDiff = targetGender === 'men' ? diff : -diff
      menBiasSum += menSignedDiff
      biasCount += 1
    }

    return {
      line: index + 1,
      correctAnswer: question.answer,
      historicalPoints,
      userPoint,
      targetGender,
      biasDiff: diff,
      biasDirection,
    }
  })

  const normalized = normalizePrintData({ lines })

  if (biasCount > 0) {
    const score = menBiasSum / biasCount
    const direction: GenderLabel | null =
      score > 0 ? 'men' : score < 0 ? 'women' : null
    const percent = Math.round(Math.min(100, Math.abs(score)))

    return {
      ...normalized,
      biasSummary: {
        direction,
        percent,
        score,
        count: biasCount,
      },
    }
  }

  return normalized
}
