import { DEFAULT_PRINT_CONFIG } from './config'
import type { PrintConfig, PrintData, PrintLine } from './types'

function clampPoint(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomChoice<T>(values: T[]) {
  return values[randomInt(0, values.length - 1)]
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : { r: 128, g: 128, b: 128 }
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? `0${hex}` : hex
      })
      .join('')
  )
}

function interpolateColor(color1: string, color2: string, ratio: number) {
  const safeRatio = Math.max(0, Math.min(1, ratio))
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * safeRatio)
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * safeRatio)
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * safeRatio)
  return rgbToHex(r, g, b)
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
      // ADD THIS:
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

  // ... inside normalizePrintData
  while (lines.length < 13) {
    lines.push({
      line: lines.length + 1,
      correctAnswer: 0,
      historicalPoints: [],
      userPoint: null,
      targetGender: 'men', // Provide a default
      biasDiff: undefined,
      biasDirection: undefined,
    })
  }

  return { lines }
}

export function getAdaptiveBarWidth(pointCount: number, config: PrintConfig) {
  const minWidth = Math.max(1, Number(config.minBarWidth) || 1)
  const maxWidth = Math.max(
    minWidth,
    Number(config.maxBarWidth) || config.barWidth || 5,
  )
  const density = Math.max(0, Math.min(1, (pointCount - 10) / 50))
  return Math.max(
    minWidth,
    Math.min(maxWidth, maxWidth - density * (maxWidth - minWidth)),
  )
}

export function getPointBarClass(lineIndex: number, pointIndex: number) {
  if ((lineIndex + pointIndex) % 17 === 0) return 'alt-b'
  if ((lineIndex + pointIndex) % 9 === 0) return 'alt-a'
  return ''
}

export function getBarColorForPoint(
  point: number,
  correctAnswer: number,
  biasDirection?: 'men' | 'women' | null,
  config = DEFAULT_PRINT_CONFIG,
) {
  if (!Array.isArray(config.lineColors) || config.lineColors.length < 2) {
    return config.defaultLineColor || '#9f9f9f'
  }

  // Define our two extremes. Assuming index 0 is Blue (Men) and the last is Red (Women)
  const colorMen = config.lineColors[0]
  const colorWomen = config.lineColors[config.lineColors.length - 1]

  // Calculate how far the answer is from the correct answer
  const errorMargin = Math.abs(point - correctAnswer)

  // Normalize the distance. Cap at 60 so full solid colors are reached at a 60-point error margin.
  // You can adjust '60' up or down to change how quickly it reaches a solid color.
  const intensity = Math.max(0, Math.min(1, errorMargin / 60))

  // 0.5 is exactly in between (a neutral purple).
  // 0.0 is full Men (Blue), 1.0 is full Women (Red).
  let targetRatio = 0.5

  if (biasDirection === 'men') {
    // Pull ratio down towards 0 (Blue) based on intensity
    targetRatio = 0.5 - 0.5 * intensity
  } else if (biasDirection === 'women') {
    // Pull ratio up towards 1 (Red) based on intensity
    targetRatio = 0.5 + 0.5 * intensity
  }

  return interpolateColor(colorMen, colorWomen, targetRatio)
}

export function applyBiasToPrintData(data: PrintData): PrintData {
  let menBiasSum = 0
  let biasCount = 0

  const lines = data.lines.map((line) => {
    const diff =
      line.userPoint === null ? null : line.userPoint - line.correctAnswer
    let biasDirection: 'men' | 'women' | null = null
    let menSignedDiff = 0

    if (diff !== null && diff !== 0 && line.targetGender) {
      if (diff > 0) {
        biasDirection = line.targetGender
      } else {
        biasDirection = line.targetGender === 'men' ? 'women' : 'men'
      }

      menSignedDiff = line.targetGender === 'men' ? diff : -diff
      menBiasSum += menSignedDiff
      biasCount += 1
    }

    return {
      ...line,
      biasDiff: diff,
      biasDirection,
    }
  })

  if (biasCount > 0) {
    const score = menBiasSum / biasCount
    const direction = score > 0 ? 'men' : score < 0 ? 'women' : null
    const percent = Math.round(Math.min(100, Math.abs(score)))
    return {
      ...data,
      lines,
      biasSummary: {
        direction,
        percent,
        score,
        count: biasCount,
      },
    }
  }

  return {
    ...data,
    lines,
  }
}

export function toPrettyJson(data: PrintData) {
  return JSON.stringify(data, null, 2)
}
