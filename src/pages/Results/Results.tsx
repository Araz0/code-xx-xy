import { memo } from 'react'
import { ResultsView } from '../../components'

const ResultsRaw = () => {
  return <ResultsView />
}

export const Results = memo(ResultsRaw)
