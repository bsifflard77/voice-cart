import { Item } from '../types'
import ItemCard from './ItemCard'

interface ShoppingListProps {
  items: Item[]
  onPickup: (id: number) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, name: string, notes?: string) => void
}

export default function ShoppingList({ items, onPickup, onDelete, onUpdate }: ShoppingListProps) {
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
    <div className="space-y-8">
      {/* Active Items - Grouped by Department */}
      {activeItems.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-2xl font-bold text-gray-900">
              Shopping List
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary-100 text-primary-700">
              {activeItems.length} {activeItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          {activeGroups.map(([departmentName, deptItems]) => (
            <div key={departmentName} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <div className="flex-1 h-px bg-gradient-to-r from-primary-200 to-transparent"></div>
                <h3 className="text-base font-bold text-primary-700 uppercase tracking-wide">
                  {departmentName}
                </h3>
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  {deptItems.length}
                </span>
                <div className="flex-1 h-px bg-gradient-to-l from-primary-200 to-transparent"></div>
              </div>
              <div className="space-y-2.5">
                {deptItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onPickup={onPickup}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Picked Up Items */}
      {pickedUpItems.length > 0 && (
        <div className="space-y-4 pt-4 border-t-2 border-gray-200">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold text-gray-600">
              Picked Up
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              {pickedUpItems.length}
            </span>
          </div>
          {pickedUpGroups.map(([departmentName, deptItems]) => (
            <div key={departmentName} className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 px-1 uppercase tracking-wide">
                {departmentName}
              </h3>
              <div className="space-y-2">
                {deptItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onPickup={onPickup}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 mb-4">
            <svg
              className="w-10 h-10 text-primary-600"
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
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-500 text-base">
            Use voice or type to add your first item
          </p>
        </div>
      )}
    </div>
  )
}
