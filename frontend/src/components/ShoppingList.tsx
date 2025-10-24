import { Item } from '../types'
import ItemCard from './ItemCard'

interface ShoppingListProps {
  items: Item[]
  onPickup: (id: number) => void
  onDelete: (id: number) => void
}

export default function ShoppingList({ items, onPickup, onDelete }: ShoppingListProps) {
  // Group items by department
  const groupByDepartment = (items: Item[]) => {
    const groups = new Map<string, Item[]>()

    items.forEach(item => {
      const deptName = item.department_name || 'Other'
      if (!groups.has(deptName)) {
        groups.set(deptName, [])
      }
      groups.get(deptName)!.push(item)
    })

    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }

  const activeItems = items.filter(item => item.status === 'active')
  const pickedUpItems = items.filter(item => item.status === 'picked_up')

  const activeGroups = groupByDepartment(activeItems)
  const pickedUpGroups = groupByDepartment(pickedUpItems)

  return (
    <div className="space-y-6">
      {/* Active Items - Grouped by Department */}
      {activeItems.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 px-1">
            Shopping List ({activeItems.length})
          </h2>
          {activeGroups.map(([departmentName, deptItems]) => (
            <div key={departmentName} className="space-y-3">
              <h3 className="text-lg font-semibold text-primary-700 px-1 border-b-2 border-primary-200 pb-1">
                {departmentName} ({deptItems.length})
              </h3>
              <div className="space-y-2">
                {deptItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onPickup={onPickup}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Picked Up Items */}
      {pickedUpItems.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-600 px-1">
            Picked Up ({pickedUpItems.length})
          </h2>
          {pickedUpGroups.map(([departmentName, deptItems]) => (
            <div key={departmentName} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 px-1">
                {departmentName}
              </h3>
              <div className="space-y-2">
                {deptItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onPickup={onPickup}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          ))}
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
