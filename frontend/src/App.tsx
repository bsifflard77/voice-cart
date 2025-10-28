import { useState, useEffect } from 'react'
import VoiceInput from './components/VoiceInput'
import ManualInput from './components/ManualInput'
import ShoppingList from './components/ShoppingList'
import ShoppingListSelector from './components/ShoppingListSelector'
import Logo from './components/Logo'
import { Store, Item, ShoppingList as ShoppingListType } from './types'
import { useAuth } from './contexts/AuthContext'
import * as api from './services/api'

function App() {
  const { user, logout } = useAuth()
  const [stores, setStores] = useState<Store[]>([])
  const [selectedList, setSelectedList] = useState<ShoppingListType | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load stores on mount
  useEffect(() => {
    loadStores()
  }, [])

  // Load items when shopping list changes
  useEffect(() => {
    if (selectedList) {
      loadItems()
    } else {
      setItems([])
    }
  }, [selectedList])

  const loadStores = async () => {
    try {
      const storesData = await api.getStores()
      setStores(storesData)
      setLoading(false)
    } catch (err) {
      console.error('Error loading stores:', err)
      setError('Failed to load stores. Make sure the backend is running.')
      setLoading(false)
    }
  }

  const loadItems = async () => {
    if (!selectedList) return

    try {
      const itemsData = await api.getListItems(selectedList.id)
      setItems(itemsData)
    } catch (err) {
      console.error('Error loading items:', err)
      setError('Failed to load items')
    }
  }

  const handleAddItem = async (itemName: string) => {
    if (!selectedList) return

    try {
      const newItem = await api.addListItem(selectedList.id, { name: itemName })
      setItems([newItem, ...items])
    } catch (err) {
      console.error('Error adding item:', err)
      setError('Failed to add item')
      throw err
    }
  }

  const handlePickup = async (itemId: number) => {
    try {
      await api.markItemAsPickedUpV2(itemId)
      // Refresh items
      await loadItems()
    } catch (err) {
      console.error('Error marking item as picked up:', err)
      setError('Failed to update item')
    }
  }

  const handleDelete = async (itemId: number) => {
    try {
      await api.deleteItemV2(itemId)
      setItems(items.filter(item => item.id !== itemId))
    } catch (err) {
      console.error('Error deleting item:', err)
      setError('Failed to delete item')
    }
  }

  const handleUpdate = async (itemId: number, name: string, notes?: string) => {
    try {
      await api.updateItemV2(itemId, { name, notes })
      // Refresh items to get the updated data
      await loadItems()
    } catch (err) {
      console.error('Error updating item:', err)
      setError('Failed to update item')
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 safe-area-inset-top safe-area-inset-bottom">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <header className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4 flex-1">
                <Logo size="lg" />
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-1">
                    VoiceCartz
                  </h1>
                  <p className="text-gray-600 font-medium">
                    Your voice-first shopping companion
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-700 mb-2 font-medium">
                  Welcome, {user?.firstName || 'User'}
                </p>
                <button
                  onClick={logout}
                  className="text-xs text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <main className="space-y-6">
          <ShoppingListSelector
            stores={stores}
            onSelectList={setSelectedList}
          />

          {selectedList && (
            <>
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-md p-6 text-center text-white">
                <h3 className="text-2xl font-bold mb-1">
                  {selectedList.name}
                </h3>
                <p className="text-primary-100 text-sm font-medium">{selectedList.store_name}</p>
              </div>

              <VoiceInput onAddItem={handleAddItem} />
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 text-sm font-semibold text-gray-500">
                    or type manually
                  </span>
                </div>
              </div>
              <ManualInput onAddItem={handleAddItem} />
              <ShoppingList
                items={items}
                onPickup={handlePickup}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            </>
          )}
        </main>

        <footer className="text-center mt-16 pb-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="font-medium">AI-powered categorization</span>
          </div>
          <p className="text-xs text-gray-500">Items are automatically organized by department</p>
        </footer>
      </div>
    </div>
  )
}

export default App
