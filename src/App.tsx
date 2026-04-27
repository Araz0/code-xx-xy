import { Home } from './Home'
import { PrintPreviewPage } from './printing/PrintPreviewPage'

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'

  if (path === '/printing') {
    return <PrintPreviewPage />
  }

  return <Home />
}

export default App
