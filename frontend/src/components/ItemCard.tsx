import { useState } from 'react'
import { Item } from '../types'
import { CheckCircleIcon, TrashIcon, PencilIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid'

interface ItemCardProps {
  item: Item
  onPickup: (id: number) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, name: string, notes?: string) => void
}

export default function ItemCard({ item, onPickup, onDelete, onUpdate }: ItemCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(item.name)
  const [editNotes, setEditNotes] = useState(item.notes || '')
  const isPickedUp = item.status === 'picked_up'

  const handleSave = () => {
    if (editName.trim()) {
      onUpdate(item.id, editName.trim(), editNotes.trim() || undefined)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditName(item.name)
    setEditNotes(item.notes || '')
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-4 transition-all duration-200 ${
        isPickedUp ? 'opacity-60 bg-gray-50' : 'opacity-100'
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 text-lg font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            placeholder="Item name"
            autoFocus
          />
          <textarea
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
            placeholder="Notes (optional)"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <CheckIcon className="h-5 w-5" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              <XMarkIcon className="h-5 w-5" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold ${isPickedUp ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {item.name}
            </h3>
            {item.notes && (
              <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
            )}
            {item.ai_suggested_department && (
              <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                {item.ai_suggested_department}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 ml-4 flex-shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="p-3 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 active:bg-primary-200 transition-all duration-200 touch-manipulation"
              aria-label="Edit item"
              disabled={isPickedUp}
            >
              <PencilIcon className="h-5 w-5" />
            </button>

            <button
              onClick={() => onPickup(item.id)}
              className={`p-3 rounded-lg transition-all duration-200 touch-manipulation ${
                isPickedUp
                  ? 'bg-green-50 text-green-600 hover:bg-green-100 active:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 active:bg-green-100'
              }`}
              aria-label={isPickedUp ? 'Mark as not picked up' : 'Mark as picked up'}
            >
              {isPickedUp ? (
                <CheckCircleSolidIcon className="h-6 w-6" />
              ) : (
                <CheckCircleIcon className="h-6 w-6" />
              )}
            </button>

            <button
              onClick={() => onDelete(item.id)}
              className="p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 transition-all duration-200 touch-manipulation"
              aria-label="Delete item"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
