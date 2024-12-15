import { Button } from "./ui/button"
import { Sun, Moon, Contrast, PanelTopClose } from 'lucide-react'

interface HeaderProps {
  theme: string;
  setTheme: (theme: string) => void;
}

export function Header({ theme, setTheme }: HeaderProps) {
  return (
    <header className="w-full bg-primary text-primary-foreground p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Document and Image Describer</h1>
        <div className="flex space-x-2">
          {Object.keys(theme).map((themeName) => (
            <Button 
              key={themeName}
              onClick={() => setTheme(themeName)} 
              aria-label={`${themeName} theme`} 
              variant="secondary" 
              size="sm"
              className={`${theme === themeName ? 'ring-2 ring-primary-foreground' : ''}`}
            >
              {themeName === 'default' && <Sun className="h-4 w-4" />}
              {themeName === 'dark' && <Moon className="h-4 w-4" />}
              {themeName === 'high-contrast' && <Contrast className="h-4 w-4" />}
              {themeName === 'yellow-black' && <PanelTopClose className="h-4 w-4" />}
            </Button>
          ))}
        </div>
      </div>
    </header>
  )
}