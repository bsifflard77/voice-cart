import axios from 'axios'
import type { Store, Department, Item, CreateItemRequest, UpdateItemRequest } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Stores
export const getStores = async (): Promise<Store[]> => {
  const response = await api.get<Store[]>('/api/stores')
  return response.data
}

export const getStore = async (id: number): Promise<Store> => {
  const response = await api.get<Store>(`/api/stores/${id}`)
  return response.data
}

// Departments
export const getDepartmentsByStore = async (storeId: number): Promise<Department[]> => {
  const response = await api.get<Department[]>(`/api/departments/store/${storeId}`)
  return response.data
}

// Items
export const getActiveItems = async (storeId: number): Promise<Item[]> => {
  const response = await api.get<any>(`/api/items/store/${storeId}`)
  // Backend returns grouped format: { items_by_department: {...}, total_items: N }
  // We need to flatten it into an array of items
  const data = response.data

  if (data.items_by_department) {
    const allItems: Item[] = []
    Object.values(data.items_by_department).forEach((deptItems: any) => {
      allItems.push(...deptItems)
    })
    return allItems
  }

  return []
}

export const getPurchaseHistory = async (
  storeId: number,
  page: number = 1,
  limit: number = 50
): Promise<Item[]> => {
  const response = await api.get<Item[]>(`/api/items/store/${storeId}/history`, {
    params: { page, limit },
  })
  return response.data
}

export const createItem = async (data: CreateItemRequest): Promise<Item> => {
  const response = await api.post<Item>('/api/items', data)
  return response.data
}

export const updateItem = async (id: number, data: UpdateItemRequest): Promise<Item> => {
  const response = await api.put<Item>(`/api/items/${id}`, data)
  return response.data
}

export const markItemAsPickedUp = async (id: number): Promise<Item> => {
  const response = await api.patch<Item>(`/api/items/${id}/pickup`)
  return response.data
}

export const deleteItem = async (id: number, permanent: boolean = false): Promise<void> => {
  await api.delete(`/api/items/${id}`, {
    params: { permanent },
  })
}

// Health check
export const healthCheck = async (): Promise<{ status: string; database: string }> => {
  const response = await api.get('/health')
  return response.data
}

export default api
