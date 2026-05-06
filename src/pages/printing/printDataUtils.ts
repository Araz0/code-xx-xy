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
          : undefined
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

function summarizeBias(menBiasSum: number, biasCount: number) {
  if (biasCount <= 0) return undefined
  const score = menBiasSum / biasCount
  const direction: GenderLabel | null =
    score > 0 ? 'men' : score < 0 ? 'women' : null
  const percent = Math.round(Math.min(100, Math.abs(score)))
  return {
    direction,
    percent,
    score,
    count: biasCount,
  }
}

function getMenSignedDiff(diff: number, targetGender: GenderLabel) {
  return targetGender === 'men' ? diff : -diff
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
      menBiasSum += getMenSignedDiff(diff, line.targetGender!)
      biasCount += 1
    })
  })

  return summarizeBias(menBiasSum, biasCount)
}

function getBiasDirectionFromDiff(
  diff: number | null,
  targetGender?: GenderLabel,
) {
  if (!targetGender || diff === null || diff === 0) return null
  return diff > 0 ? targetGender : targetGender === 'men' ? 'women' : 'men'
}

export function applyBiasToPrintData(data: PrintData): PrintData {
  const lines = data.lines.map((line) => {
    const diff =
      line.userPoint === null ? null : line.userPoint - line.correctAnswer
    const biasDirection = getBiasDirectionFromDiff(diff, line.targetGender)

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
  const historicalSetCount = lines.reduce(
    (maxCount, line) => Math.max(maxCount, line.historicalPoints.length),
    0,
  )
  const historicalBiasBySet = Array.from(
    { length: historicalSetCount },
    (_, setIndex) =>
      calculateBiasSummary(lines, (line) => [line.historicalPoints[setIndex]]),
  ).filter((summary): summary is NonNullable<typeof summary> =>
    Boolean(summary),
  )

  return {
    ...data,
    lines,
    ...(biasSummary ? { biasSummary } : {}),
    ...(historicalBiasSummary ? { historicalBiasSummary } : {}),
    ...(historicalBiasBySet.length ? { historicalBiasBySet } : {}),
  }
}

export function toPrettyJson(data: PrintData) {
  return JSON.stringify(data, null, 2)
}
