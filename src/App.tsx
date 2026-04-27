import { Home } from './Home'
import { PrintPreviewPage } from './printing/PrintPreviewPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/printing' element={<PrintPreviewPage />} />
        <Route index path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
