import { Home, PrintPreviewPage, Form } from './pages'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="page-container">
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/printing" element={<PrintPreviewPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
