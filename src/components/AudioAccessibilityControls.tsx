import React, { useState } from 'react'
import { Volume2, Mic, Headphones, Globe2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const AudioAccessibilityControls: React.FC = () => {
  const [isListening, setIsListening] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en-US')

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      startListening()
    } else {
      stopListening()
    }
  }

  const startListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.start()
    }
  }

  const stopListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.stop()
    }
  }

  const speakDescription = () => {
    const text = "This is the description of the uploaded file."
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = selectedLanguage
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones className="w-6 h-6" />
          Audio Accessibility Features
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice Commands
          </h3>
          <p className="text-sm text-muted-foreground">
            Say "upload document", "upload image", "change theme", "increase/decrease/reset text size", or "read description" to control the app.
          </p>
          <Button 
            className="w-full" 
            variant={isListening ? "destructive" : "default"}
            onClick={toggleListening}
          >
            <Mic className="w-4 h-4 mr-2" />
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Text-to-Speech
          </h3>
          <p className="text-sm text-muted-foreground">
            Read out the description of the uploaded file.
          </p>
          <Button className="w-full" variant="secondary" onClick={speakDescription}>
            <Volume2 className="w-4 h-4 mr-2" />
            Speak Description
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Globe2 className="w-5 h-5" />
            Voice Command Language
          </h3>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="en-GB">English (UK)</SelectItem>
              <SelectItem value="es-ES">Spanish</SelectItem>
              <SelectItem value="fr-FR">French</SelectItem>
              <SelectItem value="de-DE">German</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

export default AudioAccessibilityControls