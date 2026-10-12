import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '@fontsource-variable/geist'
import App from './App.tsx'
import { HomeRedirect } from './pages/HomeRedirect.tsx'
import { YearPage } from './pages/YearPage.tsx'
import './index.css'

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomeRedirect />} />
          <Route path=":year" element={<YearPage />} />
          <Route path=":year/:slug" element={<YearPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
