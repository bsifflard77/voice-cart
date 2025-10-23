import { ShoppingItem } from '../App'
import ItemDisplay from './ItemDisplay'

interface ShoppingListProps {
  items: ShoppingItem[]
  onToggleItem: (id: string) => void
  onDeleteItem: (id: string) => void
}

function ShoppingList({ items, onToggleItem, onDeleteItem }: ShoppingListProps) {
  const activeItems = items.filter(item => !item.completed)
  const completedItems = items.filter(item => item.completed)

  return (
    <div className="space-y-6">
      {/* Active Items */}
      {activeItems.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3 px-1">
            Shopping List ({activeItems.length})
          </h2>
          <div className="space-y-2">
            {activeItems.map(item => (
              <ItemDisplay
                key={item.id}
                item={item}
                onToggle={onToggleItem}
                onDelete={onDeleteItem}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Items */}
      {completedItems.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-600 mb-3 px-1">
            Completed ({completedItems.length})
          </h2>
          <div className="space-y-2">
            {completedItems.map(item => (
              <ItemDisplay
                key={item.id}
                item={item}
                onToggle={onToggleItem}
                onDelete={onDeleteItem}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-500">
            Use voice input to add your first item
          </p>
        </div>
      )}
    </div>
  )
}

export default ShoppingList
