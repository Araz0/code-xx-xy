import { Home, PrintPreviewPage, Form } from './pages'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className='page-container'>
      <BrowserRouter>
        <Routes>
          <Route path='/printing' element={<PrintPreviewPage />} />
          <Route index path='/' element={<Home />} />
          <Route index path='/form' element={<Form />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
