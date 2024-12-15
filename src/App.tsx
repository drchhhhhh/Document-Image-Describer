'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Progress } from "./components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { AlertCircle, FileText, ImageIcon, Sun, Moon, Contrast, PanelTopClose, Volume2, VolumeX } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

// Add this type declaration at the top of the file, after the SpeechRecognition interfaces
type ThemeColors = {
  [key: string]: string;
}

type Themes = {
  [key: string]: ThemeColors;
}

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
  },
}

export default function DocumentImageDescriber() {
  const [theme, setTheme] = useState<keyof Themes>('default')
  const [fontFamily, setFontFamily] = useState('sans')
  const [textSize, setTextSize] = useState(16)
  const [documentProgress, setDocumentProgress] = useState(0)
  const [imageProgress, setImageProgress] = useState(0)
  const [results, setResults] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceLanguage, setVoiceLanguage] = useState('en-US')
  const [customCommands, setCustomCommands] = useState({
    uploadDocument: 'upload document',
    uploadImage: 'upload image',
    changeTheme: 'change theme',
    increaseTextSize: 'increase text size',
    decreaseTextSize: 'decrease text size',
    resetTextSize: 'reset text size',
    readDescription: 'read description'
  })
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesisRef.current = window.speechSynthesis
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        recognitionRef.current = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)() as SpeechRecognition
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
      }
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.fontSize = `${textSize}px`
  }, [textSize])

  useEffect(() => {
    const root = document.documentElement
    Object.entries(themes[theme]).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
  }, [theme])

  const adjustTextSize = (action: 'increase' | 'decrease' | 'reset') => {
    setTextSize(prevSize => {
      let newSize = prevSize
      switch (action) {
        case 'increase':
          newSize = Math.min(prevSize + 2, 32)
          break
        case 'decrease':
          newSize = Math.max(prevSize - 2, 12)
          break
        case 'reset':
          newSize = 16
          break
      }
      announceChange(`Text size changed to ${newSize} pixels`)
      return newSize
    })
  }

  const simulateProgress = (type: 'document' | 'image') => {
    const setProgress = type === 'document' ? setDocumentProgress : setImageProgress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        const result = `${type === 'document' ? 'Document' : 'Image'} processed successfully! This ${type} appears to contain multiple paragraphs of text describing various topics related to accessibility and inclusive design.`
        setResults(result)
        announceChange(`${type === 'document' ? 'Document' : 'Image'} description ready`)
      }
    }, 200)
  }

  const handleFileUpload = (type: 'document' | 'image') => {
    setError(null)
    setResults(null)
    const fileInput = document.getElementById(type === 'document' ? 'document-upload' : 'image-upload') as HTMLInputElement
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      simulateProgress(type)
    } else {
      setError(`Please select a ${type} first.`)
      announceChange(`No ${type} selected`)
    }
  }

  const announceChange = (message: string) => {
    const announcement = document.getElementById('a11y-announce')
    if (announcement) {
      announcement.textContent = message
    }
  }

  const toggleSpeechRecognition = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop()
      } else {
        recognitionRef.current.lang = voiceLanguage
        recognitionRef.current.start()
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript.toLowerCase()
          if (transcript.includes(customCommands.uploadDocument)) {
            handleFileUpload('document')
          } else if (transcript.includes(customCommands.uploadImage)) {
            handleFileUpload('image')
          } else if (transcript.includes(customCommands.changeTheme)) {
            const themeKeys = Object.keys(themes)
            const currentIndex = themeKeys.indexOf(theme)
            const nextTheme = themeKeys[(currentIndex + 1) % themeKeys.length]
            setTheme(nextTheme)
          } else if (transcript.includes(customCommands.increaseTextSize)) {
            adjustTextSize('increase')
          } else if (transcript.includes(customCommands.decreaseTextSize)) {
            adjustTextSize('decrease')
          } else if (transcript.includes(customCommands.resetTextSize)) {
            adjustTextSize('reset')
          } else if (transcript.includes(customCommands.readDescription)) {
            speakDescription()
          } else if (transcript.includes('scroll down')) {
            window.scrollBy(0, 100)
          } else if (transcript.includes('scroll up')) {
            window.scrollBy(0, -100)
          } else if (transcript.includes('zoom in')) {
            setTextSize(prev => Math.min(prev + 2, 32))
          } else if (transcript.includes('zoom out')) {
            setTextSize(prev => Math.max(prev - 2, 12))
          }
        }
        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
      setIsListening(!isListening)
    } else {
      announceChange("Speech recognition is not supported in your browser.")
    }
  }

  const speakDescription = () => {
    if (speechSynthesisRef.current && results) {
      if (isSpeaking) {
        speechSynthesisRef.current.cancel()
        setIsSpeaking(false)
      } else {
        const utterance = new SpeechSynthesisUtterance(results)
        utterance.onend = () => setIsSpeaking(false)
        speechSynthesisRef.current.speak(utterance)
        setIsSpeaking(true)
      }
    } else if (!results) {
      announceChange("No description available to read.")
    } else {
      announceChange("Text-to-speech is not supported in your browser.")
    }
  }

  const handleLanguageChange = (lang: string) => {
    setVoiceLanguage(lang)
    announceChange(`Voice command language changed to ${lang}`)
  }

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground font-${fontFamily}`}>
      <Header theme={theme} setTheme={setTheme} />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-8">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Accessibility Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Text Size</h3>
                  <div className="flex items-center gap-4">
                    <Button 
                      onClick={() => adjustTextSize('decrease')} 
                      aria-label="Decrease text size" 
                      variant="secondary"
                      size="sm"
                    >
                      A-
                    </Button>
                    <span className="text-sm font-medium">{textSize}px</span>
                    <Button 
                      onClick={() => adjustTextSize('increase')} 
                      aria-label="Increase text size" 
                      variant="secondary"
                      size="sm"
                    >
                      A+
                    </Button>
                    <Button 
                      onClick={() => adjustTextSize('reset')} 
                      aria-label="Reset text size" 
                      variant="secondary"
                      size="sm"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Color Theme</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(themes).map((themeName) => (
                      <Button 
                        key={themeName}
                        onClick={() => setTheme(themeName)} 
                        aria-label={`${themeName} theme`} 
                        variant="outline" 
                        className={`${theme === themeName ? 'ring-2 ring-primary' : ''}`}
                      >
                        {themeName === 'default' && <Sun className="mr-2" />}
                        {themeName === 'dark' && <Moon className="mr-2" />}
                        {themeName === 'high-contrast' && <Contrast className="mr-2" />}
                        {themeName === 'yellow-black' && <PanelTopClose className="mr-2" />}
                        {themeName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Audio Accessibility Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Voice Commands</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Say "upload document", "upload image", "change theme", "increase/decrease/reset text size", or "read description" to control the app.
                  </p>
                  <Button 
                    onClick={toggleSpeechRecognition} 
                    aria-label={isListening ? "Stop listening" : "Start listening for voice commands"} 
                    variant="default"
                  >
                    {isListening ? <VolumeX className="mr-2" /> : <Volume2 className="mr-2" />}
                    {isListening ? "Stop Listening" : "Start Listening"}
                  </Button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Text-to-Speech</h3>
                  <p className="text-sm mb-2">Read out the description of the uploaded file.</p>
                  <Button onClick={speakDescription} disabled={!results} aria-label={isSpeaking ? "Stop speaking" : "Start speaking description"} className="btn-primary">
                    {isSpeaking ? <VolumeX className="mr-2" /> : <Volume2 className="mr-2" />}
                    {isSpeaking ? "Stop Speaking" : "Speak Description"}
                  </Button>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Voice Command Language</h3>
                  <Select 
                    onValueChange={handleLanguageChange} 
                    defaultValue={voiceLanguage}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                      <SelectItem value="fr-FR">Français</SelectItem>
                      <SelectItem value="de-DE">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="document" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="document">Document Upload</TabsTrigger>
              <TabsTrigger value="image">Image Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="document">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Document</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="document-upload">Select a document to describe (PDF, DOC, DOCX)</Label>
                    <Input id="document-upload" type="file" accept=".pdf,.doc,.docx" />
                  </div>
                  <Progress value={documentProgress} className="w-full" />
                  <Button 
                    onClick={() => handleFileUpload('document')} 
                    className="w-full"
                  >
                    <FileText className="mr-2" />
                    Describe Document
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="image">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="image-upload">Select an image to describe (JPG, PNG)</Label>
                    <Input id="image-upload" type="file" accept="image/*" />
                  </div>
                  <Progress value={imageProgress} className="w-full" />
                  <Button 
                    onClick={() => handleFileUpload('image')} 
                    className="w-full"
                  >
                    <ImageIcon className="mr-2" />
                    Describe Image
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {(results || error) && (
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                {results && (
                  <p className="text-green-600 dark:text-green-400">
                    {results}
                  </p>
                )}
                {error && (
                  <p className="text-red-600 flex items-center">
                    <AlertCircle className="mr-2" />
                    {error}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
      <div 
        id="a11y-announce" 
        className="sr-only" 
        aria-live="polite"
      ></div>
    </div>
  )
}