import { useState } from 'react'
import VoiceInput from './components/VoiceInput'
import ShoppingList from './components/ShoppingList'

export interface ShoppingItem {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

function App() {
  const [items, setItems] = useState<ShoppingItem[]>([])

  const addItem = (text: string) => {
    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
    }
    setItems([newItem, ...items])
  }

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            VoiceCart
          </h1>
          <p className="text-gray-600">
            Your voice-first shopping list
          </p>
        </header>

        <main className="space-y-6">
          <VoiceInput onAddItem={addItem} />
          <ShoppingList
            items={items}
            onToggleItem={toggleItem}
            onDeleteItem={deleteItem}
          />
        </main>

        <footer className="text-center mt-12 text-sm text-gray-500">
          <p>Tap the microphone to add items with your voice</p>
        </footer>
      </div>
    </div>
  )
}

export default App
