import {
  Home,
  PrintResultsPage,
  PrintTestPage,
  Form,
  Results,
  PresenterPage,
} from './pages'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function getRouterBasename() {
  const pathname = window.location.pathname
  if (pathname === '/') return '/'

  const lastSlashIndex = pathname.lastIndexOf('/')
  return lastSlashIndex >= 0 ? pathname.slice(0, lastSlashIndex + 1) : '/'
}

function App() {
  const basename = getRouterBasename()

  return (
    <div className='page-container'>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route index path='/' element={<Home />} />
          <Route path='/form' element={<Form />} />
          <Route path='/print-results' element={<PrintResultsPage />} />
          <Route path='/print-test' element={<PrintTestPage />} />
          <Route path='/results' element={<Results />} />
          <Route path='/presenter' element={<PresenterPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
