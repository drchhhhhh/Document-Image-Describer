import { useState, useEffect } from 'react'
import { ThemeProvider, useTheme } from './components/ThemeProvider'
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
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Document and Image Processor</h1>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <AccessibilityControls />
          <AudioAccessibilityControls />
        </div>

        <div className="mt-8">
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List className="flex space-x-1 rounded-xl bg-secondary p-1">
              <Tab className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                 ring-white ring-opacity-60 ring-offset-2 ring-offset-primary focus:outline-none focus:ring-2
                 ${selected 
                   ? 'bg-primary text-primary-foreground shadow' 
                   : 'text-secondary-foreground hover:bg-primary/[0.12] hover:text-primary'
                 }`
              }>
                Document Upload
              </Tab>
              <Tab className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                 ring-white ring-opacity-60 ring-offset-2 ring-offset-primary focus:outline-none focus:ring-2
                 ${selected 
                   ? 'bg-primary text-primary-foreground shadow' 
                   : 'text-secondary-foreground hover:bg-primary/[0.12] hover:text-primary'
                 }`
              }>
                Image Upload
              </Tab>
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