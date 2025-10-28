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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Type item name..."
          className="flex-1 px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          disabled={isAdding}
        />
        <button
          type="submit"
          disabled={isAdding || !itemName.trim()}
          className="px-7 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          <PlusCircleIcon className="h-5 w-5" />
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </form>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}
