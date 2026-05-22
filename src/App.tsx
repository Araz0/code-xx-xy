import {
  Home,
  PrintResultsPage,
  PrintTestPage,
  Form,
  Results,
  PresenterPage,
} from './pages'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStoreValue } from 'zustand-x'
import { quizStore } from './quizStore'
import i18n from './i18n.ts'

function getRouterBasename() {
  const pathname = window.location.pathname
  if (pathname === '/') return '/'

  const lastSlashIndex = pathname.lastIndexOf('/')
  return lastSlashIndex >= 0 ? pathname.slice(0, lastSlashIndex + 1) : '/'
}

function App() {
  const basename = getRouterBasename()

  return (
    <BrowserRouter basename={basename}>
      <AppShell />
    </BrowserRouter>
  )
}

function AppShell() {
  const { t } = useTranslation()
  const location = useLocation()
  const language = useStoreValue(quizStore, 'language')

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language)
    }
  }, [language])

  useEffect(() => {
    document.documentElement.lang = language

    const path = location.pathname
    const titleKey =
      path === '/'
        ? 'titles.home'
        : path.startsWith('/form')
          ? 'titles.form'
          : path.startsWith('/print-results')
            ? 'titles.printResults'
            : path.startsWith('/print-test')
              ? 'titles.printTest'
              : path.startsWith('/results')
                ? 'titles.results'
                : path.startsWith('/presenter')
                  ? 'titles.presenter'
                  : 'titles.home'

    document.title = t(titleKey)
  }, [language, location.pathname, t])

  return (
    <div className='page-container'>
      <Routes>
        <Route index path='/' element={<Home />} />
        <Route path='/form' element={<Form />} />
        <Route path='/print-results' element={<PrintResultsPage />} />
        <Route path='/print-test' element={<PrintTestPage />} />
        <Route path='/results' element={<Results />} />
        <Route path='/presenter' element={<PresenterPage />} />
      </Routes>
    </div>
  )
}

export default App
