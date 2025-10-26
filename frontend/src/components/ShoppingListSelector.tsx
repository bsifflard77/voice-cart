import { useState, useEffect } from 'react'
import { ShoppingList, Store } from '../types'
import * as api from '../services/api'

interface ShoppingListSelectorProps {
  stores: Store[]
  onSelectList: (list: ShoppingList | null) => void
}

const ShoppingListSelector = ({ stores, onSelectList }: ShoppingListSelectorProps) => {
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListStoreId, setNewListStoreId] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLists()
  }, [])

  const loadLists = async () => {
    try {
      setLoading(true)
      const data = await api.getShoppingLists()
      setLists(data)

      // Auto-select the first active list
      const activeList = data.find(list => list.status === 'active')
      if (activeList && !selectedList) {
        setSelectedList(activeList)
        onSelectList(activeList)
      }

      setLoading(false)
    } catch (err) {
      console.error('Error loading shopping lists:', err)
      setError('Failed to load shopping lists')
      setLoading(false)
    }
  }

  const handleSelectList = (list: ShoppingList) => {
    setSelectedList(list)
    onSelectList(list)
  }

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListName.trim()) return

    try {
      const newList = await api.createShoppingList({
        storeId: newListStoreId,
        name: newListName,
      })

      setLists([newList, ...lists])
      setSelectedList(newList)
      onSelectList(newList)
      setNewListName('')
      setShowCreateForm(false)
    } catch (err) {
      console.error('Error creating list:', err)
      setError('Failed to create shopping list')
    }
  }

  const handleCompleteList = async (listId: number) => {
    try {
      await api.completeShoppingList(listId)
      await loadLists()

      // If the completed list was selected, clear selection
      if (selectedList?.id === listId) {
        setSelectedList(null)
        onSelectList(null)
      }
    } catch (err) {
      console.error('Error completing list:', err)
      setError('Failed to complete shopping list')
    }
  }

  const handleDeleteList = async (listId: number) => {
    if (!confirm('Are you sure you want to delete this shopping list?')) return

    try {
      await api.deleteShoppingList(listId)
      setLists(lists.filter(list => list.id !== listId))

      // If the deleted list was selected, clear selection
      if (selectedList?.id === listId) {
        setSelectedList(null)
        onSelectList(null)
      }
    } catch (err) {
      console.error('Error deleting list:', err)
      setError('Failed to delete shopping list')
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">My Shopping Lists</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition"
        >
          {showCreateForm ? 'Cancel' : '+ New List'}
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-1 text-xs text-red-600 hover:text-red-800 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {showCreateForm && (
        <form onSubmit={handleCreateList} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="mb-3">
            <label htmlFor="listName" className="block text-sm font-medium text-gray-700 mb-1">
              List Name
            </label>
            <input
              id="listName"
              type="text"
              required
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="e.g., Weekly Groceries"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="listStore" className="block text-sm font-medium text-gray-700 mb-1">
              Store
            </label>
            <select
              id="listStore"
              value={newListStoreId}
              onChange={(e) => setNewListStoreId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              {stores.map(store => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Create List
          </button>
        </form>
      )}

      {lists.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You don't have any shopping lists yet.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Create your first list
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {lists.map(list => {
            const store = stores.find(s => s.id === list.store_id)
            const isSelected = selectedList?.id === list.id
            const isActive = list.status === 'active'

            return (
              <div
                key={list.id}
                className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                } ${!isActive ? 'opacity-60' : ''}`}
                onClick={() => isActive && handleSelectList(list)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{list.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {store?.name || 'Unknown Store'}
                    </p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span>{list.active_items_count || 0} active</span>
                      <span>{list.picked_up_items_count || 0} picked up</span>
                      <span className="capitalize">{list.status}</span>
                    </div>
                  </div>

                  {isActive && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCompleteList(list.id)
                        }}
                        className="text-xs text-green-600 hover:text-green-700 font-semibold"
                        title="Mark as completed"
                      >
                        Complete
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteList(list.id)
                        }}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold"
                        title="Delete list"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ShoppingListSelector
