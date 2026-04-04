'use client'
import {
  createContext, useContext,
  useEffect, useState
} from 'react'

type Theme = 'dark' | 'light'

interface ThemeCtxValue {
  theme:    Theme
  toggle:   () => void
  setTheme: (t: Theme) => void
  isDark:   boolean
}

const ThemeCtx = createContext<ThemeCtxValue>({
  theme:'dark', toggle:()=>{}, setTheme:()=>{}, isDark:true
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial: Theme = savedTheme || (systemDark ? 'dark' : 'light')
    applyTheme(initial)
  }, [])

  const applyTheme = (t: Theme) => {
    setThemeState(t)
    document.documentElement.setAttribute('data-theme', t)
    localStorage.setItem('theme', t)
    // Force repaint for any stubborn elements
    document.documentElement.style.colorScheme = t
  }

  const toggle   = () => applyTheme(theme === 'dark' ? 'light' : 'dark')
  const setTheme = (t: Theme) => applyTheme(t)

  return (
    <ThemeCtx.Provider value={{
      theme, toggle, setTheme, isDark: theme === 'dark'
    }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
