import { memo, useEffect } from 'react'
import { QuestionCard, UserInfoForm } from '../../components'
import { quizStore } from '../../quizStore'
import { useStoreValue } from 'zustand-x'

export const FormRaw = () => {
  const status = useStoreValue(quizStore, 'status')

  useEffect(() => {
    if (status === 'idle') {
      quizStore.set('startQuiz')
    }
  }, [status])

  return <>{status === 'user-info' ? <UserInfoForm /> : <QuestionCard />}</>
}

export const Form = memo(FormRaw)
