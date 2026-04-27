import { memo, useEffect } from 'react'
import { QuestionCard } from '../../components'
import { quizStore } from '../../quizStore'

export const FormRaw = () => {
  useEffect(() => {
    quizStore.set('startQuiz')
  }, [])

  return (
    <>
      <QuestionCard />
    </>
  )
}

export const Form = memo(FormRaw)
