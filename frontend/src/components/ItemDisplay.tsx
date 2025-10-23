import { ShoppingItem } from '../App'

interface ItemDisplayProps {
  item: ShoppingItem
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

function ItemDisplay({ item, onToggle, onDelete }: ItemDisplayProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-4 transition-all hover:shadow-lg ${
        item.completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-center space-x-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(item.id)}
          className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-primary-500 flex items-center justify-center transition-colors hover:bg-primary-50"
          aria-label={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {item.completed && (
            <svg
              className="w-4 h-4 text-primary-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Item Text */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-base font-medium break-words ${
              item.completed
                ? 'line-through text-gray-500'
                : 'text-gray-800'
            }`}
          >
            {item.text}
          </p>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(item.id)}
          className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          aria-label="Delete item"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ItemDisplay
