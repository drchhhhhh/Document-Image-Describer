import { useState, useEffect } from 'react'
import { ThemeProvider, useTheme } from './components/ThemeProvider'
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import Layout from './components/Layout'
import DocumentUpload from './components/DocumentUpload'
import ImageUpload from './components/ImageUpload'
import { Tab } from '@headlessui/react'
import AccessibilityControls from './components/AccessibilityControls'
import AudioAccessibilityControls from './components/AudioAccessibilityControls'

function AppContent() {
  const { theme } = useTheme()
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    // Change tab based on theme
    if (theme === 'default' || theme === 'dark') {
      setSelectedIndex(0) // Document Upload
    } else if (theme === 'high-contrast' || theme === 'yellow-black') {
      setSelectedIndex(1) // Image Upload
    }
  }, [theme])

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 pt-8">
      <Card className="w-full bg-gradient-to-r from-primary/10 to-secondary/10 shadow-md mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">
              Welcome to Document and Image Describer
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">
              Upload your documents or images and get detailed descriptions with our AI-powered tool.
            </p>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <AccessibilityControls />
          <AudioAccessibilityControls />
        </div>

        <div className="mt-8">
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List className="flex space-x-1 rounded-xl bg-primary-foreground p-1">
              {['Document Upload', 'Image Upload'].map((tabName, index) => (
                <Tab
                  key={tabName}
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors duration-200
                     ring-white ring-opacity-60 ring-offset-2 ring-offset-primary focus:outline-none focus:ring-2
                     ${
                       selected
                         ? 'bg-primary text-primary-foreground' : 'bg-primary-foreground text-primary'
                     }
                     ${
                       theme === 'high-contrast'
                         ? selected
                           ? 'bg-white text-black'
                           : 'bg-black text-white hover:bg-white/[0.12] hover:text-white'
                         : theme === 'yellow-black'
                         ? selected
                           ? 'bg-primary text-primary-foreground' : 'bg-primary-foreground text-primary'
                         : ''
                     }`
                  }
                >
                  {tabName}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel>
                <DocumentUpload />
              </Tab.Panel>
              <Tab.Panel>
                <ImageUpload />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </Layout>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App