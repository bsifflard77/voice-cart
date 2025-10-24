import { useState, useEffect } from 'react'
import VoiceInput from './components/VoiceInput'
import ManualInput from './components/ManualInput'
import ShoppingList from './components/ShoppingList'
import StoreSelector from './components/StoreSelector'
import { Store, Item } from './types'
import * as api from './services/api'

function App() {
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load stores on mount
  useEffect(() => {
    loadStores()
  }, [])

  // Load items when store changes
  useEffect(() => {
    if (selectedStore) {
      loadItems()
    }
  }, [selectedStore])

  const loadStores = async () => {
    try {
      const storesData = await api.getStores()
      setStores(storesData)
      // Auto-select first store
      if (storesData.length > 0 && !selectedStore) {
        setSelectedStore(storesData[0])
      }
      setLoading(false)
    } catch (err) {
      console.error('Error loading stores:', err)
      setError('Failed to load stores. Make sure the backend is running.')
      setLoading(false)
    }
  }

  const loadItems = async () => {
    if (!selectedStore) return

    try {
      const itemsData = await api.getActiveItems(selectedStore.id)
      setItems(itemsData)
    } catch (err) {
      console.error('Error loading items:', err)
      setError('Failed to load items')
    }
  }

  const handleAddItem = async (itemName: string) => {
    if (!selectedStore) return

    try {
      const newItem = await api.createItem({
        storeId: selectedStore.id,
        name: itemName,
      })
      setItems([newItem, ...items])
    } catch (err) {
      console.error('Error adding item:', err)
      setError('Failed to add item')
      throw err
    }
  }

  const handlePickup = async (itemId: number) => {
    try {
      await api.markItemAsPickedUp(itemId)
      // Refresh items
      await loadItems()
    } catch (err) {
      console.error('Error marking item as picked up:', err)
      setError('Failed to update item')
    }
  }

  const handleDelete = async (itemId: number) => {
    try {
      await api.deleteItem(itemId, false)
      setItems(items.filter(item => item.id !== itemId))
    } catch (err) {
      console.error('Error deleting item:', err)
      setError('Failed to delete item')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 safe-area-inset-top safe-area-inset-bottom">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🛒 VoiceCart
          </h1>
          <p className="text-gray-600">
            Your voice-first shopping list
          </p>
        </header>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <main className="space-y-6">
          <StoreSelector
            stores={stores}
            selectedStore={selectedStore}
            onSelectStore={setSelectedStore}
          />

          {selectedStore && (
            <>
              <VoiceInput onAddItem={handleAddItem} />
              <div className="text-center text-sm text-gray-500 my-2">or</div>
              <ManualInput onAddItem={handleAddItem} />
              <ShoppingList
                items={items}
                onPickup={handlePickup}
                onDelete={handleDelete}
              />
            </>
          )}
        </main>

        <footer className="text-center mt-12 text-sm text-gray-500">
          <p>Tap the microphone to add items with your voice</p>
          <p className="mt-2 text-xs">Items are auto-categorized by AI</p>
        </footer>
      </div>
    </div>
  )
}

export default App
