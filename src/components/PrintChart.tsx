import type { CSSProperties } from 'react'
import type {
  GenderLabel,
  PrintData,
  PrintConfig,
} from '../pages/printing/types'
import { getBarColorForPoint } from '../pages/printing/printDataUtils'

export interface PrintChartProps {
  printData: PrintData
  config: PrintConfig
  cssVariables: CSSProperties
  headerText: string
  legendText: { correct: string; historical: string; user: string }
  language?: 'en' | 'de'
}

export function PrintChart({
  printData,
  config,
  cssVariables,
  headerText,
  legendText,
  language = 'en',
}: PrintChartProps) {
  const summary = printData.biasSummary
  const biasText = summary
    ? buildBiasText(summary.direction, summary.percent, language)
    : null
  const biasMarkerLeft = summary
    ? Math.max(0, Math.min(100, 50 + summary.score / 2))
    : 50

  return (
    <main
      className="print-page"
      style={cssVariables}
      aria-label="Printable chart preview"
    >
      <header className="print-header">
        <h1>{headerText}</h1>
      </header>
      {printData.lines.map((lineData, lineIndex) => {
        const userColor = getUserBarColor(lineData, config)

        return (
          <section
            className="line-row"
            key={lineData.line}
            style={
              {
                '--line-color':
                  config.lineColors[lineIndex] || config.defaultLineColor,
              } as CSSProperties
            }
          >
            <div className="line-number">{lineData.line}</div>
            <div className="line-bars">
              <div className="bars-layer">
                {lineData.historicalPoints.map(
                  (point: number, pointIndex: number) => (
                    <div
                      className="point-bar historical-bar"
                      key={`${lineData.line}-${pointIndex}-${point}`}
                      style={{
                        left: `calc(${point}% - (var(--historical-bar-width) / 2))`,
                      }}
                    />
                  ),
                )}

                <div
                  className="point-bar correct-answer-bar"
                  style={{
                    left: `calc(${lineData.correctAnswer}% - (var(--correct-bar-width) / 2))`,
                  }}
                />

                {lineData.userPoint !== null ? (
                  <div
                    className="point-bar user-bar"
                    style={{
                      left: `calc(${lineData.userPoint}% - (var(--user-bar-width) / 2))`,
                      ...(userColor ? { backgroundColor: userColor } : {}),
                    }}
                  />
                ) : null}
              </div>
            </div>
          </section>
        )
      })}
      <div className="print-legend" role="list">
        <div className="legend-item" role="listitem">
          <span className="legend-line correct" />
          <span>{legendText.correct}</span>
        </div>
        <div className="legend-item" role="listitem">
          <span className="legend-line" />
          <span>{legendText.historical}</span>
        </div>
        <div className="legend-item" role="listitem">
          <span
            className="legend-swatch legend-block legend-gradient"
            aria-label="User answer gradient"
          />
          <span>{legendText.user}</span>
        </div>
      </div>
      {summary && biasText ? (
        <div className="bias-summary">
          <div className="bias-bar" aria-label="Total bias">
            <span
              className="bias-marker"
              style={{ left: `${biasMarkerLeft}%` }}
            />
          </div>
          <p className="bias-text">{biasText}</p>
        </div>
      ) : null}
    </main>
  )
}

function getUserBarColor(
  lineData: PrintData['lines'][number],
  config: PrintConfig,
) {
  // If the user didn't answer, return nothing
  if (lineData.userPoint === null) return undefined

  // Let getBarColorForPoint handle the gradient based on the bias and distance
  const barColor = getBarColorForPoint(
    lineData.userPoint,
    lineData.correctAnswer,
    lineData.biasDirection,
    config,
  )

  return barColor
}

function buildBiasText(
  direction: GenderLabel | null,
  percent: number,
  language: 'en' | 'de',
) {
  if (language === 'de') {
    if (direction === 'women') {
      return `Deine Einschätzungen überschätzen systematisch weibliche Beteiligung. Der gemessene Bias beträgt ${percent} % in Richtung Vorurteil gegen Männer. Dies kann auf internalisierte Stereotype oder selektive Wahrnehmungsmuster hinweisen, die deine Urteile systematisch beeinflussen.`
    }
    if (direction === 'men') {
      return `Deine Einschätzungen überschätzen systematisch männliche Beteiligung. Der gemessene Bias beträgt ${percent} % in Richtung Vorurteil gegen Frauen. Dies kann auf internalisierte Stereotype oder selektive Wahrnehmungsmuster hinweisen, die deine Urteile systematisch beeinflussen.`
    }

    return `Deine Einschätzungen liegen insgesamt nahe an den Referenzwerten. Der gemessene Bias beträgt ${percent} %.`
  }

  if (direction === 'women') {
    return `Your estimates systematically overstate female participation. The measured bias is ${percent}%, leaning toward bias against men. This may reflect internalized stereotypes or selective perception patterns that influence your judgments.`
  }
  if (direction === 'men') {
    return `Your estimates systematically overstate male participation. The measured bias is ${percent}%, leaning toward bias against women. This may reflect internalized stereotypes or selective perception patterns that influence your judgments.`
  }

  return `Your estimates are overall close to the reference values. The measured bias is ${percent}%.`
}
