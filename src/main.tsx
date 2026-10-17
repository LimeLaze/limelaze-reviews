import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '@fontsource-variable/geist'
import App from './App.tsx'
import { AboutPage } from './pages/AboutPage.tsx'
import { EveryGamePage } from './pages/EveryGamePage.tsx'
import { HomeRedirect } from './pages/HomeRedirect.tsx'
import { Top20Page } from './pages/Top20Page.tsx'
import { YearPage } from './pages/YearPage.tsx'
import './index.css'

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomeRedirect />} />
          <Route path="top-20" element={<Top20Page />} />
          <Route path="every-game" element={<EveryGamePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path=":year" element={<YearPage />} />
          <Route path=":year/:slug" element={<YearPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
