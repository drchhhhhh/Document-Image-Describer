import React from 'react'
import { useTheme } from './ThemeProvider'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="bg-background shadow-md border-b border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary mr-2" />
              <span className="text-2xl font-bold text-primary">DocuSense</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" className="bg-background text-foreground hover:text-primary hover:bg-primary/10">
                Home
              </Button>
              <Button variant="ghost" className="bg-background text-foreground hover:text-primary hover:bg-primary/10">
                About
              </Button>
              <Button variant="ghost" className="bg-background text-foreground hover:text-primary hover:bg-primary/10">
                Contact
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}

export default Layout