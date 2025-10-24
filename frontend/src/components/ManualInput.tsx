import { useState } from 'react'
import { PlusCircleIcon } from '@heroicons/react/24/outline'

interface ManualInputProps {
  onAddItem: (text: string) => Promise<void>
}

export default function ManualInput({ onAddItem }: ManualInputProps) {
  const [itemName, setItemName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!itemName.trim()) return

    setIsAdding(true)
    setError(null)

    try {
      await onAddItem(itemName.trim())
      setItemName('') // Clear input on success
    } catch (err) {
      setError('Failed to add item')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Type item name..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isAdding}
        />
        <button
          type="submit"
          disabled={isAdding || !itemName.trim()}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          <PlusCircleIcon className="h-5 w-5" />
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
