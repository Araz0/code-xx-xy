import { createStore } from 'zustand-x'
import questionsData from './questions.json'

// --- TYPES ---

// The raw question structure from questions.json
export type RawQuestion = (typeof questionsData.questions)[number] & {
  id: number
}

// The transformed question structure with language-specific fields
export type Question = Omit<RawQuestion, 'title' | 'question'> & {
  title: string
  question: string
}

type QuizState = {
  status: 'idle' | 'in-progress' | 'completed'
  language: 'en' | 'de'
  rawQuestions: RawQuestion[]
  currentIndex: number
  userAnswers: number[] // Store answers by index
}

// --- HELPERS ---

// Detect browser language (default to 'en' if not 'de')
const getInitialLanguage = (): 'en' | 'de' => {
  if (
    typeof navigator !== 'undefined' &&
    navigator.language?.startsWith('de')
  ) {
    return 'de'
  }
  return 'en'
}

// Add a unique ID to each question for more reliable keying
const getInitialQuestions = (): RawQuestion[] => {
  return questionsData.questions.map((q, index) => ({ ...q, id: index }))
}

// --- INITIAL STATE ---

const initialState: QuizState = {
  status: 'idle',
  language: getInitialLanguage(),
  rawQuestions: getInitialQuestions(),
  currentIndex: 0,
  userAnswers: [],
}

// --- STORE ---

export const quizStore = createStore(initialState, {
  name: 'quiz-store',
  persist: {
    // Only persist user-specific state, not the raw questions
    partialize: (state) => ({
      status: state.status,
      language: state.language,
      currentIndex: state.currentIndex,
      userAnswers: state.userAnswers,
    }),
  },
})
  .extendSelectors(({ get }) => {
    /**
     * Transforms a raw question into a language-specific question.
     */
    const transformQuestion = (
      question: RawQuestion,
      lang: 'en' | 'de',
    ): Question => {
      return {
        ...question,
        title: question.title[lang] || question.title.en,
        question: question.question[lang] || question.question.en,
      }
    }

    return {
      totalQuestions: () => get('rawQuestions').length,
      isLastQuestion: () =>
        get('currentIndex') >= get('rawQuestions').length - 1,

      /**
       * Returns the current question object, translated to the active language.
       */
      currentQuestion: (): Question | undefined => {
        const lang = get('language')
        const questions = get('rawQuestions')
        const currentIndex = get('currentIndex')
        const rawQuestion = questions[currentIndex]

        if (!rawQuestion) return undefined

        return transformQuestion(rawQuestion, lang)
      },

      /**
       * Returns the current user's guess for the current question.
       */
      currentGuess: (): number => {
        const currentIndex = get('currentIndex')
        return get('userAnswers')[currentIndex] ?? 0 // Default to 0
      },

      /**
       * Returns all questions, translated to the active language.
       */
      allQuestions: (): Question[] => {
        const lang = get('language')
        const questions = get('rawQuestions')
        return questions.map((q) => transformQuestion(q, lang))
      },

      /**
       * Prepares the final results for submission.
       * Returns an array of objects with the question, correct answer, and user's answer.
       */
      getResultsForSubmission: () => {
        const questions = get('rawQuestions')
        const answers = get('userAnswers')
        return questions.map((q, index) => ({
          questionTitle: q.title.en, // Use english title as a consistent key
          correctAnswer: q.answer,
          userAnswer: answers[index] ?? null,
        }))
      },
    }
  })
  .extendActions(({ get, set }) => ({
    /**
     * Starts or restarts the quiz, resetting all progress.
     */
    startQuiz: () => {
      set('status', 'in-progress')
      set('currentIndex', 0)
      // Initialize answers array with default values
      const total = get('rawQuestions').length
      set('userAnswers', Array(total).fill(0)) // Default to 0 for all answers
    },

    /**
     * Updates the user's answer for the current question.
     */
    updateCurrentAnswer: (answer: number) => {
      const currentIndex = get('currentIndex')
      set('userAnswers', (answers) => {
        const newAnswers = [...answers]
        newAnswers[currentIndex] = answer
        return newAnswers
      })
    },

    /**
     * Moves to the next question.
     */
    nextQuestion: () => {
      if (!get('isLastQuestion')) {
        set('currentIndex', (index) => index + 1)
      }
    },

    /**
     * Moves to the previous question.
     */
    previousQuestion: () => {
      const currentIndex = get('currentIndex')
      if (currentIndex > 0) {
        set('currentIndex', (index) => index - 1)
      }
    },

    /**
     * Finishes the quiz and sets its status to 'completed'.
     */
    finishQuiz: () => {
      // Here you could add final validation if needed
      set('status', 'completed')
      // In the future, you would call the Supabase submission logic from here.
    },

    /**
     * Toggles the language between 'en' and 'de'.
     */
    toggleLanguage: () => {
      set('language', (lang) => (lang === 'en' ? 'de' : 'en'))
    },
  }))
