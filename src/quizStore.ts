import { createStore } from 'zustand-x'
import questionsData from './questions.json'

export type Question = (typeof questionsData.questions)[number]

type QuizState = {
  started: boolean
  completed: boolean
  showResults: boolean
  revealRealValues: boolean
  currentIndex: number
  questions: Question[]
  answers: Record<string, number>
}

const initialState: QuizState = {
  started: false,
  completed: false,
  showResults: false,
  revealRealValues: false,
  currentIndex: 0,
  questions: questionsData.questions,
  answers: {},
}

export const quizStore = createStore(initialState, {
  name: 'quiz-store',
  persist: true,
})
  .extendSelectors(({ get }) => ({
    totalQuestions: () => get('questions').length,
    currentQuestion: () => get('questions')[get('currentIndex')],
    isLastQuestion: () => get('currentIndex') >= get('questions').length - 1,
    currentGuess: () => {
      const question = get('questions')[get('currentIndex')]
      if (!question) return 50

      return get('answers')[question.title] ?? 50
    },
  }))
  .extendActions(({ get, set }) => ({
    start: () => {
      set('started', true)
      set('completed', false)
      set('showResults', false)
      set('revealRealValues', false)
      set('currentIndex', 0)
      set('answers', {})
    },
    setCurrentGuess: (value: number) => {
      const question = get('questions')[get('currentIndex')]
      if (!question) return

      set('answers', (answers) => ({
        ...answers,
        [question.title]: value,
      }))
    },
    next: () => {
      const question = get('questions')[get('currentIndex')]
      if (question) {
        const existingGuess = get('answers')[question.title]
        set('answers', (answers) => ({
          ...answers,
          [question.title]: existingGuess ?? 50,
        }))
      }

      if (get('isLastQuestion')) {
        set('completed', true)
        set('showResults', false)
        set('revealRealValues', false)
        return
      }

      set('currentIndex', (index) => index + 1)
    },
    showResults: () => {
      set('showResults', true)
      set('revealRealValues', false)
    },
    revealResults: () => {
      set('revealRealValues', true)
    },
  }))
