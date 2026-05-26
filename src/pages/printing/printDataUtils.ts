import type { GenderLabel, PrintData, PrintLine } from './types'

function clampPoint(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomChoice<T>(values: T[]) {
  return values[randomInt(0, values.length - 1)]
}

function buildRandomLine(seed: number, intensity = 1) {
  const points: number[] = []
  const clusterCount = randomInt(2, 4 + intensity)
  const centers: number[] = []
  const maxClusters = Math.min(6, clusterCount)

  while (centers.length < maxClusters) {
    const center = randomInt(4, 96)
    if (centers.every((existing) => Math.abs(existing - center) > 8)) {
      centers.push(center)
    }
  }

  centers
    .sort((a, b) => a - b)
    .forEach((center, clusterIndex) => {
      const clusterSize = randomInt(
        Math.max(2, 2 + intensity - 1),
        Math.min(10, 4 + intensity * 2),
      )
      const spread = randomChoice([0.7, 0.9, 1, 1.2, 1.4, 1.6])

      for (let i = 0; i < clusterSize; i += 1) {
        const offset = i - (clusterSize - 1) / 2
        const wobble = randomInt(-2, 2) + ((seed + clusterIndex + i) % 3) - 1
        points.push(clampPoint(center + offset * spread + wobble))
      }

      if (intensity > 1 && Math.random() > 0.4) {
        points.push(clampPoint(center + randomInt(-4, 4)))
      }
    })

  const scatterCount = randomInt(1, 3 + intensity * 2)
  for (let i = 0; i < scatterCount; i += 1) {
    points.push(clampPoint(randomInt(0, 100)))
  }

  return [...new Set(points)].sort((a, b) => a - b)
}

export function generateRandomData(intensity?: number): PrintData {
  const safeIntensity = Math.max(
    1,
    Math.min(4, Number(intensity) || randomInt(1, 4)),
  )

  return {
    lines: Array.from({ length: 13 }, (_, index) => ({
      line: index + 1,
      correctAnswer: randomInt(20, 80),
      historicalPoints: buildRandomLine(
        index + randomInt(1, 999),
        safeIntensity,
      ),
      userPoint: randomInt(0, 100),
      targetGender: randomChoice(['men', 'women'] as const),
    })),
  }
}

export function normalizePrintData(data: unknown): PrintData {
  if (
    typeof data !== 'object' ||
    data === null ||
    !('lines' in data) ||
    !Array.isArray((data as { lines: unknown }).lines)
  ) {
    throw new Error('JSON must include "lines" array.')
  }

  const lines = (data as { lines: Array<Partial<PrintLine>> }).lines
    .slice(0, 13)
    .map((line, index) => {
      const legacyPoints = Array.isArray((line as { points?: unknown }).points)
        ? (line as { points: unknown[] }).points
        : []
      const sourcePoints = Array.isArray(line.historicalPoints)
        ? line.historicalPoints
        : legacyPoints
      const validPoints = sourcePoints
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value))
        .map((value) => Math.max(0, Math.min(100, value)))
      const correctAnswer = Number(line.correctAnswer) || 0
      const userPoint = Number.isFinite(line.userPoint)
        ? clampPoint(Number(line.userPoint))
        : null
      const targetGender =
        line.targetGender === 'men' || line.targetGender === 'women'
          ? line.targetGender
          : 'men'
      const biasDiff = Number.isFinite(line.biasDiff)
        ? Number(line.biasDiff)
        : undefined
      const biasDirection =
        line.biasDirection === 'men' || line.biasDirection === 'women'
          ? line.biasDirection
          : undefined

      return {
        line: index + 1,
        correctAnswer: Math.max(0, Math.min(100, correctAnswer)),
        historicalPoints: validPoints,
        userPoint,
        targetGender,
        biasDiff,
        biasDirection,
      }
    })

  while (lines.length < 13) {
    lines.push({
      line: lines.length + 1,
      correctAnswer: 0,
      historicalPoints: [],
      userPoint: null,
      targetGender: 'men',
      biasDiff: undefined,
      biasDirection: undefined,
    })
  }

  return { lines }
}

type BiasSummary = NonNullable<PrintData['biasSummary']>

/**
 * Calculates how much bias favors men (positive) or women (negative)
 * @param menBiasSum - Sum of signed differences (positive = favors men)
 * @param biasCount - Number of data points analyzed
 * @returns Bias summary or undefined if no data
 */
function summarizeBias(
  menBiasSum: number,
  biasCount: number,
): BiasSummary | undefined {
  if (biasCount <= 0) return undefined

  // Calculate average bias score (range: -100 to 100, but can theoretically exceed)
  const rawScore = menBiasSum / biasCount
  // Clamp to meaningful range [-100, 100]
  const score = Math.max(-100, Math.min(100, rawScore))
  const direction: GenderLabel | null =
    score > 0 ? 'men' : score < 0 ? 'women' : null
  // Convert to percentage (0-100) of bias magnitude
  const percent = Math.round(Math.abs(score))

  return {
    direction,
    percent,
    score,
    count: biasCount,
  }
}

/**
 * Converts a raw difference into a signed value where:
 * Positive = bias toward men, Negative = bias toward women
 *
 * @param diff - Raw difference (userPoint - correctAnswer)
 * @param targetGender - Which gender this line is targeting
 * @returns Signed bias value (positive favors men, negative favors women)
 *
 * @example
 * // If targeting women and diff is +10 (user guessed 10 points higher)
 * // This actually favors women (since higher score benefits women)
 * // So bias toward men = -10 (negative = favors women)
 * getBiasTowardMen(10, 'women') // returns -10
 */
function getBiasTowardMen(diff: number, targetGender: GenderLabel): number {
  // For 'men' target: higher diff directly means bias toward men
  // For 'women' target: higher diff actually favors women, so invert the sign
  return targetGender === 'men' ? diff : -diff
}

/**
 * Determines which gender is favored by a bias
 *
 * @param diff - Raw difference (userPoint - correctAnswer)
 * @param targetGender - Which gender this line is targeting
 * @returns The gender favored by the bias, or null if no bias
 *
 * @example
 * getBiasDirection(10, 'women') // returns 'women' (higher diff favors women)
 * getBiasDirection(-5, 'men')   // returns 'women' (lower diff disfavors men)
 */
function getBiasDirection(
  diff: number | null,
  targetGender?: GenderLabel,
): GenderLabel | null {
  if (!targetGender || diff === null || diff === 0) return null

  const biasTowardMen = getBiasTowardMen(diff, targetGender)

  if (biasTowardMen > 0) return 'men'
  if (biasTowardMen < 0) return 'women'
  return null
}

export function calculateBiasSummary(
  lines: PrintLine[],
  getPoints: (line: PrintLine) => Array<number | null | undefined>,
): BiasSummary | undefined {
  let menBiasSum = 0
  let biasCount = 0

  lines.forEach((line) => {
    if (!line.targetGender) return

    const points = getPoints(line)
      .map((value) => (Number.isFinite(value) ? Number(value) : null))
      .filter((value): value is number => value !== null)

    points.forEach((point) => {
      const diff = point - line.correctAnswer
      menBiasSum += getBiasTowardMen(diff, line.targetGender)
      biasCount += 1
    })
  })

  return summarizeBias(menBiasSum, biasCount)
}

export function applyBiasToPrintData(data: PrintData): PrintData {
  const lines = data.lines.map((line) => {
    const diff =
      line.userPoint === null ? null : line.userPoint - line.correctAnswer
    const biasDirection = getBiasDirection(diff, line.targetGender)

    return {
      ...line,
      biasDiff: diff,
      biasDirection,
    }
  })

  const biasSummary = calculateBiasSummary(lines, (line) => [line.userPoint])
  const historicalBiasSummary = calculateBiasSummary(
    lines,
    (line) => line.historicalPoints,
  )

  // Calculate bias for each historical data point set
  const historicalSetCount = lines.reduce(
    (maxCount, line) => Math.max(maxCount, line.historicalPoints.length),
    0,
  )

  const historicalBiasBySet = Array.from(
    { length: historicalSetCount },
    (_, setIndex) =>
      calculateBiasSummary(lines, (line) => [line.historicalPoints[setIndex]]),
  ).filter(
    (summary): summary is NonNullable<typeof summary> =>
      summary !== undefined && summary.count > 0,
  )

  return {
    ...data,
    lines,
    ...(biasSummary ? { biasSummary } : {}),
    ...(historicalBiasSummary ? { historicalBiasSummary } : {}),
    ...(historicalBiasBySet.length > 0 ? { historicalBiasBySet } : {}),
  }
}

export function toPrettyJson(data: PrintData) {
  return JSON.stringify(data, null, 2)
}
