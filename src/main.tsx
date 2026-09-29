import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { applyNativeChrome } from './lib/native'
import { refreshRemoteSnapshot } from './lib/remoteSnapshot'

applyNativeChrome()

async function bootstrap() {
  // Give the over-the-air snapshot a short window before first render so the
  // dashboard opens with this morning's data when available.
  await Promise.race([refreshRemoteSnapshot().catch(() => false), new Promise((r) => setTimeout(r, 3000))])

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
}

bootstrap()
