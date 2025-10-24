import { useState, useRef } from 'react'

interface VoiceInputProps {
  onAddItem: (text: string) => Promise<void>
}

function VoiceInput({ onAddItem }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef<any>(null)

  const startListening = () => {
    setError(null)
    setTranscript('')

    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.lang = 'en-US'
    recognition.continuous = true  // Keep listening
    recognition.interimResults = true  // Show interim results
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      console.log('Voice recognition started')
    }

    recognition.onresult = async (event) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      // Show interim results
      if (interimTranscript) {
        setTranscript(interimTranscript)
      }

      // Process final result
      if (finalTranscript.trim()) {
        setTranscript(finalTranscript.trim())
        setIsListening(false)
        recognitionRef.current?.stop()

        setIsProcessing(true)
        try {
          await onAddItem(finalTranscript.trim())
          // Clear transcript after 2 seconds on success
          setTimeout(() => setTranscript(''), 2000)
        } catch (err) {
          setError('Failed to add item. Please try again.')
        } finally {
          setIsProcessing(false)
        }
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again and speak clearly.')
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access in your browser.')
      } else {
        setError(`Error: ${event.error}`)
      }
      setIsListening(false)
      recognitionRef.current = null
    }

    recognition.onend = () => {
      console.log('Voice recognition ended')
      setIsListening(false)
      recognitionRef.current = null
    }

    try {
      recognition.start()
    } catch (err) {
      setError('Failed to start voice recognition')
      console.error(err)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-xl ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : isProcessing
              ? 'bg-yellow-500 animate-pulse'
              : 'bg-primary-500 hover:bg-primary-600'
          }`}
          aria-label={isListening ? 'Stop recording' : isProcessing ? 'Processing...' : 'Start recording'}
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
          {isListening ? 'Listening... (tap to stop)' : isProcessing ? 'Adding item...' : 'Tap to speak'}
        </p>

        {/* Show interim transcript while listening */}
        {isListening && transcript && (
          <div className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Hearing:</p>
            <p className="text-blue-700 font-medium italic">{transcript}</p>
          </div>
        )}

        {!isListening && transcript && (
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
