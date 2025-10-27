/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Web Speech API types
interface Window {
  SpeechRecognition: any
  webkitSpeechRecognition: any
}
