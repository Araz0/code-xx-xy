import {
  Home,
  PrintPreviewPage,
  PrintResultsPage,
  Form,
  Results,
} from './pages'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="page-container">
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/printing" element={<PrintPreviewPage />} />
          <Route path="/print-results" element={<PrintResultsPage />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
