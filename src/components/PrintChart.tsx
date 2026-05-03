import type { CSSProperties } from 'react'
import type { GenderLabel, PrintData } from '../pages/printing/types'

export interface PrintChartProps {
  printData: PrintData
  cssVariables: CSSProperties
  headerText: string
  legendText: { correct: string; historical: string; user: string }
  language?: 'en' | 'de'
}

export function PrintChart({
  printData,
  cssVariables,
  headerText,
  legendText,
  language = 'en',
}: PrintChartProps) {
  const summary = printData.biasSummary
  const historicalBiasBySet = printData.historicalBiasBySet ?? []
  const biasText = summary
    ? buildBiasText(summary.direction, summary.percent, language)
    : null
  const biasMarkerLeft = summary ? getBiasMarkerLeft(summary.score) : 50

  return (
    <main
      className="print-page"
      style={cssVariables}
      aria-label="Printable chart preview"
    >
      <header className="print-header">
        <h1>{headerText}</h1>
      </header>
      {printData.lines.map((lineData) => {
        return (
          <section className="line-row" key={lineData.line}>
            <div className="line-number">{lineData.line}</div>
            <div className="line-bars">
              <div className="bars-layer">
                {lineData.historicalPoints.map(
                  (point: number, pointIndex: number) => (
                    <div
                      className="point-dot historical-dot"
                      key={`${lineData.line}-${pointIndex}-${point}`}
                      style={{
                        left: `${point}%`,
                      }}
                    />
                  ),
                )}

                <div
                  className="point-dot correct-dot"
                  style={{
                    left: `${lineData.correctAnswer}%`,
                  }}
                />

                {lineData.userPoint !== null ? (
                  <div
                    className="point-dot user-dot"
                    style={{
                      left: `${lineData.userPoint}%`,
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
          <span className="legend-dot legend-dot-correct" />
          <span>{legendText.correct}</span>
        </div>
        <div className="legend-item" role="listitem">
          <span className="legend-dot legend-dot-historical" />
          <span>{legendText.historical}</span>
        </div>
        <div className="legend-item" role="listitem">
          <span className="legend-dot legend-dot-user" />
          <span>{legendText.user}</span>
        </div>
      </div>
      {summary && biasText ? (
        <div className="bias-summary">
          <div className="bias-scale" aria-label="Total bias">
            <span className="bias-center-dot" style={{ left: '50%' }} />
            {historicalBiasBySet.map((summaryItem, index) => (
              <span
                className="bias-marker-dot historical-bias-dot"
                key={`historical-bias-${index}`}
                style={{ left: `${getBiasMarkerLeft(summaryItem.score)}%` }}
              />
            ))}
            <span
              className="bias-marker-dot"
              style={{ left: `${biasMarkerLeft}%` }}
            />
          </div>
          <p className="bias-text">{biasText}</p>
        </div>
      ) : null}
    </main>
  )
}

function getBiasMarkerLeft(score: number) {
  return Math.max(0, Math.min(100, 50 + score / 2))
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
