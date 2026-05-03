import type { GenderLabel, PrintData } from './types'
import type { RawQuestion } from '../../quizStore'
import { calculateBiasSummary, normalizePrintData } from './printDataUtils'

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
    if (diff !== null && diff !== 0) {
      biasDirection =
        diff > 0 ? targetGender : targetGender === 'men' ? 'women' : 'men'
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
  const biasSummary = calculateBiasSummary(normalized.lines, (line) => [
    line.userPoint,
  ])
  const historicalBiasSummary = calculateBiasSummary(
    normalized.lines,
    (line) => line.historicalPoints,
  )
  const historicalSetCount = normalized.lines.reduce(
    (maxCount, line) => Math.max(maxCount, line.historicalPoints.length),
    0,
  )
  const historicalBiasBySet = Array.from(
    { length: historicalSetCount },
    (_, setIndex) =>
      calculateBiasSummary(normalized.lines, (line) => [
        line.historicalPoints[setIndex],
      ]),
  ).filter((summary): summary is NonNullable<typeof summary> =>
    Boolean(summary),
  )

  return {
    ...normalized,
    ...(biasSummary ? { biasSummary } : {}),
    ...(historicalBiasSummary ? { historicalBiasSummary } : {}),
    ...(historicalBiasBySet.length ? { historicalBiasBySet } : {}),
  }
}
