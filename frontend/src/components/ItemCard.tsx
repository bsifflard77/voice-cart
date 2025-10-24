import { Item } from '../types'
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid'

interface ItemCardProps {
  item: Item
  onPickup: (id: number) => void
  onDelete: (id: number) => void
}

export default function ItemCard({ item, onPickup, onDelete }: ItemCardProps) {
  const isPickedUp = item.status === 'picked_up'

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 transition-all ${
        isPickedUp ? 'opacity-60' : 'opacity-100'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`text-lg font-medium ${isPickedUp ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {item.name}
          </h3>
          {item.notes && (
            <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
          )}
          {item.ai_suggested_department && (
            <p className="text-xs text-primary-600 mt-1">
              AI suggested: {item.ai_suggested_department}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onPickup(item.id)}
            className={`p-2 rounded-full transition-colors ${
              isPickedUp
                ? 'text-green-600 hover:text-green-700'
                : 'text-gray-400 hover:text-green-600'
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
            className="p-2 rounded-full text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Delete item"
          >
            <TrashIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  )
}
