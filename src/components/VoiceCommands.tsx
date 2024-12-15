import React, { useState, useEffect } from 'react'
import { Mic, VolumeX } from 'lucide-react'

const VoiceCommands: React.FC = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    let recognition: SpeechRecognition | null = null

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event) => {
        const current = event.resultIndex
        const transcript = event.results[current][0].transcript
        setTranscript(transcript)

        handleVoiceCommand(transcript.toLowerCase())
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
      }
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [])

  const handleVoiceCommand = (command: string) => {
    if (command.includes('upload document')) {
      console.log('Voice command: Upload document')
      // Add logic to trigger document upload
    } else if (command.includes('upload image')) {
      console.log('Voice command: Upload image')
      // Add logic to trigger image upload
    } else if (command.includes('change theme')) {
      console.log('Voice command: Change theme')
      // Add logic to change theme
    } else if (command.includes('increase text size')) {
      console.log('Voice command: Increase text size')
      // Add logic to increase text size
    } else if (command.includes('decrease text size')) {
      console.log('Voice command: Decrease text size')
      // Add logic to decrease text size
    } else if (command.includes('read page')) {
      console.log('Voice command: Read page')
      readPageContent()
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startListening = () => {
    setIsListening(true)
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.start()
    }
  }

  const stopListening = () => {
    setIsListening(false)
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.stop()
    }
  }

  const readPageContent = () => {
    const content = document.body.innerText
    speak(content)
  }

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2">
      <button
        onClick={toggleListening}
        className={`p-3 rounded-full ${
          isListening ? 'bg-red-500' : 'bg-blue-500'
        } text-white hover:bg-opacity-80 transition-colors duration-300`}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        <Mic className="w-6 h-6" />
      </button>
      {isSpeaking && (
        <button
          onClick={stopSpeaking}
          className="p-3 rounded-full bg-yellow-500 text-white hover:bg-opacity-80 transition-colors duration-300"
          aria-label="Stop speaking"
        >
          <VolumeX className="w-6 h-6" />
        </button>
      )}
      {transcript && (
        <div className="mt-2 p-2 bg-background rounded-md shadow-md max-w-xs">
          <p className="text-sm text-foreground">{transcript}</p>
        </div>
      )}
    </div>
  )
}

export default VoiceCommands