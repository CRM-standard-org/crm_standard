import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@radix-ui/themes/styles.css";
import App from './App.tsx'
import './index.css'
import { Theme } from "@radix-ui/themes";
import { ForecastFilterProvider } from './features/Dashboard/ForecastFilterContext';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Theme>
        <ForecastFilterProvider>
          <App />
        </ForecastFilterProvider>
      </Theme>
  </StrictMode>,
)
