import React from 'react'
import { useTheme } from './ThemeProvider'
import { Sun, Moon, Type, Contrast, PanelTopClose, FileTypeIcon as FontFamily } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const AccessibilityControls: React.FC = () => {
  const { theme, setTheme, textSize, setTextSize, fontFamily, setFontFamily } = useTheme()

  const textSizeMap: Record<string, string> = {
    small: '14px',
    medium: '16px',
    large: '18px'
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PanelTopClose className="w-6 h-6" />
          Accessibility Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Type className="w-5 h-5" />
            Text Size
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setTextSize('small')}>
              A-
            </Button>
            <span className="px-3 py-1 bg-muted rounded">{textSizeMap[textSize]}</span>
            <Button variant="outline" size="sm" onClick={() => setTextSize('large')}>
              A+
            </Button>
            <Button variant="outline" size="sm" onClick={() => setTextSize('medium')}>
              Reset
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FontFamily className="w-5 h-5" />
            Font Family
          </h3>
          <Select value={fontFamily} onValueChange={setFontFamily}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans">Sans-serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
              <SelectItem value="dyslexic">OpenDyslexic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Contrast className="w-5 h-5" />
            Color Theme
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme('default')}
              className={theme === 'default' ? 'bg-primary text-primary-foreground' : ''}
            >
              <Sun className="w-4 h-4 mr-2" />
              Default
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme('dark')}
              className={theme === 'dark' ? 'bg-primary text-primary-foreground' : ''}
            >
              <Moon className="w-4 h-4 mr-2" />
              Dark
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme('high-contrast')}
              className={theme === 'high-contrast' ? 'bg-primary text-primary-foreground' : ''}
            >
              <Contrast className="w-4 h-4 mr-2" />
              High Contrast
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme('yellow-black')}
              className={theme === 'yellow-black' ? 'bg-primary text-primary-foreground' : ''}
            >
              <Sun className="w-4 h-4 mr-2" />
              Yellow Black
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AccessibilityControls