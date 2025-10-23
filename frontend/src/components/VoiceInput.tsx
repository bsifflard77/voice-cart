import { useState } from 'react'

interface VoiceInputProps {
  onAddItem: (text: string) => void
}

function VoiceInput({ onAddItem }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const startListening = () => {
    setError(null)

    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
      setTranscript('')
    }

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript
      setTranscript(speechResult)
      if (speechResult.trim()) {
        onAddItem(speechResult.trim())
      }
    }

    recognition.onerror = (event) => {
      setError(`Error: ${event.error}`)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={startListening}
          disabled={isListening}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-xl ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-primary-500 hover:bg-primary-600'
          }`}
          aria-label={isListening ? 'Recording...' : 'Start recording'}
        >
          {isListening ? (
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 10h6v4H9z"
              />
            </svg>
          ) : (
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          )}
        </button>

        <p className="text-center text-gray-600 font-medium">
          {isListening ? 'Listening...' : 'Tap to add item'}
        </p>

        {transcript && (
          <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Added:</p>
            <p className="text-green-700 font-medium">{transcript}</p>
          </div>
        )}

        {error && (
          <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Type declarations for browser speech recognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

export default VoiceInput
