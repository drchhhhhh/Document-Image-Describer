import React, { createContext, useContext, useState, useEffect } from 'react'
const themes = {
  default: {
    '--background': '210 50% 95%',
    '--foreground': '222 47% 11%',
    '--primary': '221 83% 53%',
    '--primary-foreground': '210 40% 98%',
    '--secondary': '210 40% 90%',
    '--secondary-foreground': '222 47% 11%',
    '--muted': '210 40% 96%',
    '--muted-foreground': '215 16% 47%',
    '--accent': '210 40% 96%',
    '--border': '214 32% 91%',
    '--card': '0 0% 100%',
    '--card-foreground': '222 47% 11%',
  },
  dark: {
    '--background': '222 84% 4.9%',
    '--foreground': '210 40% 98%',
    '--primary': '217 91.2% 59.8%',
    '--primary-foreground': '222 47.4% 11.2%',
    '--secondary': '217 32.6% 17.5%',
    '--secondary-foreground': '210 40% 98%',
    '--muted': '217 32.6% 17.5%',
    '--muted-foreground': '215 20.2% 65.1%',
    '--accent': '217 32.6% 17.5%',
    '--border': '217 32.6% 17.5%',
    '--card': '222.2 84% 4.9%',
    '--card-foreground': '210 40% 98%',
  },
  'high-contrast': {
    '--background': '0 0% 0%',
    '--foreground': '0 0% 100%',
    '--primary': '0 0% 100%',
    '--primary-foreground': '0 0% 0%',
    '--secondary': '0 0% 20%',
    '--secondary-foreground': '0 0% 100%',
    '--muted': '0 0% 20%',
    '--muted-foreground': '0 0% 80%',
    '--accent': '0 0% 20%',
    '--border': '0 0% 40%',
    '--card': '0 0% 0%',
    '--card-foreground': '0 0% 100%',
  },
  'yellow-black': {
    '--background': '60 100% 50%',
    '--foreground': '0 0% 0%',
    '--primary': '0 0% 0%',
    '--primary-foreground': '60 100% 50%',
    '--secondary': '60 100% 40%',
    '--secondary-foreground': '0 0% 0%',
    '--muted': '60 100% 40%',
    '--muted-foreground': '0 0% 20%',
    '--accent': '60 100% 40%',
    '--border': '0 0% 0%',
    '--card': '60 100% 50%',
    '--card-foreground': '0 0% 0%',
  }
};

type Theme = 'default' | 'dark' | 'high-contrast' | 'yellow-black';
type TextSize = 'small' | 'medium' | 'large'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  textSize: TextSize
  setTextSize: (size: TextSize) => void
  fontFamily: string
  setFontFamily: (font: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('default')
  const [textSize, setTextSize] = useState<TextSize>('medium')
  const [fontFamily, setFontFamily] = useState<string>('sans')

  useEffect(() => {
    const root = document.documentElement;
    const selectedTheme = themes[theme];

    Object.entries(selectedTheme).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    const textSizeMap: Record<TextSize, string> = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }
    root.style.fontSize = textSizeMap[textSize]

    root.style.fontFamily = getFontFamily(fontFamily);
  }, [theme, textSize, fontFamily]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, textSize, setTextSize, fontFamily, setFontFamily }}>
      {children}
    </ThemeContext.Provider>
  )
}

function getFontFamily(font: string): string {
  switch (font) {
    case 'sans':
      return 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
    case 'serif':
      return 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
    case 'mono':
      return 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
    case 'dyslexic':
      return '"OpenDyslexic", sans-serif'
    default:
      return 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
  }
}