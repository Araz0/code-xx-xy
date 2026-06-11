import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { GenderLabel, PrintData } from '../pages/printing/types'

interface PrintChartProps {
  printData: PrintData
  cssVariables: CSSProperties
  headerText: string
  subHeaderText?: string
  legendText: { correct: string; historical: string; user: string }
}

export function PrintChartPresenter({
  printData,
  cssVariables,
  headerText,
  subHeaderText,
  legendText,
}: PrintChartProps) {
  const { t } = useTranslation()
  const summary = printData.biasSummary
  const historicalBiasBySet = printData.historicalBiasBySet ?? []
  const allParticipantsBias = printData.historicalBiasSummary
  const biasText = summary
    ? buildBiasText(t, summary.direction, summary.percent)
    : null

  const allParticipantsMarkerLeft = allParticipantsBias
    ? getBiasMarkerLeft(allParticipantsBias.score)
    : null

  useEffect(() => {
    if (!summary) return

    console.log('[PrintChart] bias summary', {
      score: summary.score,
      percent: summary.percent,
      direction: summary.direction,
      historicalBiasBySet,
      allParticipantsBias,
    })
  }, [historicalBiasBySet, allParticipantsBias, summary])

  return (
    <main
      className='print-page'
      style={cssVariables}
      aria-label={t('printChart.ariaLabel')}
    >
      <header className='print-header'>
        <div className='print-header-content'>
          <div className='print-header-left'>
            <span className='print-header-maintext'>{headerText}</span>
            {subHeaderText && (
              <>
                <br />
                <span className='print-header-subtext'>{subHeaderText}</span>
              </>
            )}
          </div>
          {/* <h1>{userName}</h1>
          <div className='print-header-right'>{userAge}</div> */}
        </div>
      </header>
      {printData.lines.map((lineData) => {
        return (
          <section className='line-row' key={lineData.line}>
            <div className='line-number'>{lineData.line}</div>
            <div className='line-bars'>
              <div className='bars-layer'>
                {lineData.historicalPoints.map(
                  (point: number, pointIndex: number) => (
                    <div
                      className='point-dot historical-dot'
                      key={`${lineData.line}-${pointIndex}-${point}`}
                      style={{
                        left: `${point}%`,
                      }}
                    />
                  ),
                )}

                <div
                  className='point-dot correct-dot'
                  style={{
                    left: `${lineData.correctAnswer}%`,
                  }}
                />

                {lineData.userPoint !== null ? (
                  <div
                    className='point-dot user-dot'
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
      <div className='print-legend presenter' role='list'>
        <div className='presenter-legend-item legend-item' role='listitem'>
          <span className='legend-dot legend-dot-user' />
          <span>{legendText.user}</span>
        </div>
        <div className='presenter-legend-item legend-item' role='listitem'>
          <span className='legend-dot legend-dot-correct' />
          <span>{legendText.correct}</span>
        </div>
        <div className='presenter-legend-item legend-item' role='listitem'>
          <span className='legend-dot legend-dot-historical' />
          <span>{legendText.historical}</span>
        </div>
      </div>
      {/* <br /> */}
      {summary && biasText ? (
        <div className='bias-summary'>
          <p className='bias-text presenter-bias-text'>{biasText}</p>
          <div className='bias-scale' aria-label={t('results.printHeader')}>
            <span className='bias-center-dot' style={{ left: '50%' }} />
            {historicalBiasBySet.map((summaryItem, index) => (
              <span
                className='bias-marker-dot historical-bias-dot'
                key={`historical-bias-${index}`}
                style={{ left: `${getBiasMarkerLeft(summaryItem.score)}%` }}
              />
            ))}
            <span
              className='bias-marker-dot'
              style={{ left: `${allParticipantsMarkerLeft}%` }}
            />
          </div>
          <div
            className='presenter-bias-direction-legend'
            aria-label={t('printChart.biasLegend.ariaLabel')}
          >
            <span className='bias-direction-legend-left'>
              {t('printChart.biasLegend.left')}
            </span>
            <span className='bias-direction-legend-center'>
              {t('printChart.biasLegend.center')}
            </span>
            <span className='bias-direction-legend-right'>
              {t('printChart.biasLegend.right')}
            </span>
          </div>
        </div>
      ) : null}
      <p className='print-footer-note'>{t('results.printFooterNote')}</p>
    </main>
  )
}

function getBiasMarkerLeft(score: number) {
  return Math.max(0, Math.min(100, 50 + score))
}

function buildBiasText(
  t: TFunction,
  direction: GenderLabel | null,
  percent: number,
) {
  const bandKey = getBiasBandKey(percent)
  const biasDirectionKey =
    direction === 'women' ? 'women' : direction === 'men' ? 'men' : 'neutral'
  const baseText = t(`printChart.biasBands.${bandKey}.body`)
  const prefix = t(`printChart.biasBands.${bandKey}.forPresenter`, {
    percent,
    biasDirection: t(`printChart.biasDirection.${biasDirectionKey}`),
  })

  return `${prefix} ${baseText}`
}

function getBiasBandKey(percent: number) {
  const value = Math.max(0, Math.min(100, Math.round(percent)))

  if (value <= 5) return '0_5'
  if (value <= 10) return '6_10'
  if (value <= 15) return '11_15'
  if (value <= 20) return '16_20'
  if (value <= 25) return '21_25'
  if (value <= 30) return '26_30'
  if (value <= 35) return '31_35'
  if (value <= 40) return '36_40'
  if (value <= 45) return '41_45'
  if (value <= 50) return '46_50'
  if (value <= 55) return '51_55'
  if (value <= 60) return '56_60'
  if (value <= 65) return '61_65'
  if (value <= 70) return '66_70'
  if (value <= 75) return '71_75'
  if (value <= 80) return '76_80'
  if (value <= 85) return '81_85'
  if (value <= 90) return '86_90'
  if (value <= 95) return '91_95'
  return '96_100'
}
