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
      points: buildRandomLine(index + randomInt(1, 999), safeIntensity),
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
      const points = Array.isArray(line.points) ? line.points : []
      const validPoints = points
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value))
        .map((value) => Math.max(0, Math.min(100, value)))
      const correctAnswer = Number(line.correctAnswer) || 0

      return {
        line: index + 1,
        correctAnswer: Math.max(0, Math.min(100, correctAnswer)),
        points: validPoints,
      }
    })

  while (lines.length < 13) {
    lines.push({ line: lines.length + 1, correctAnswer: 0, points: [] })
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
  config = DEFAULT_PRINT_CONFIG,
) {
  const palette = config.colorPalette
  const stops = [
    palette.orange.hex,
    palette.pink.hex,
    palette.grau.hex,
    palette.gelb.hex,
    palette.gruen.hex,
  ]

  const diff = point - correctAnswer
  if (Math.abs(diff) < 1) return config.correctAnswerColor

  const maxDiff = 35
  const ratio = Math.max(-1, Math.min(1, diff / maxDiff))
  const position = (ratio + 1) / 2
  const segments = stops.length - 1
  const scaled = position * segments
  const idx = Math.min(segments - 1, Math.max(0, Math.floor(scaled)))
  const t = scaled - idx

  return interpolateColor(stops[idx], stops[idx + 1], t)
}

export function toPrettyJson(data: PrintData) {
  return JSON.stringify(data, null, 2)
}
