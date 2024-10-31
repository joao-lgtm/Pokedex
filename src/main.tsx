
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { ThemeSwitchProvider } from './hooks/ThemeSwitcher.tsx'

createRoot(document.getElementById('root')!).render(
    <ThemeSwitchProvider>
      <App />
    </ThemeSwitchProvider>
)
