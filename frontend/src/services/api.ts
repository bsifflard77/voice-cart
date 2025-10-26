import axios from 'axios'
import type { Store, Department, Item, CreateItemRequest, UpdateItemRequest, User, AuthResponse, LoginRequest, RegisterRequest, ShoppingList } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token management
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('token', token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('token')
  }
}

// Initialize token from localStorage
const savedToken = localStorage.getItem('token')
if (savedToken) {
  setAuthToken(savedToken)
}

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

// V2 Items API (for authenticated users with shopping lists)
export const markItemAsPickedUpV2 = async (id: number): Promise<Item> => {
  const response = await api.post<Item>(`/api/v2/items/${id}/pickup`)
  return response.data
}

export const updateItemV2 = async (id: number, data: UpdateItemRequest): Promise<Item> => {
  const response = await api.put<Item>(`/api/v2/items/${id}`, data)
  return response.data
}

export const deleteItemV2 = async (id: number): Promise<void> => {
  await api.delete(`/api/v2/items/${id}`)
}

// Health check
export const healthCheck = async (): Promise<{ status: string; database: string }> => {
  const response = await api.get('/health')
  return response.data
}

// Authentication
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/register', data)
  if (response.data.token) {
    setAuthToken(response.data.token)
  }
  return response.data
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/login', data)
  if (response.data.token) {
    setAuthToken(response.data.token)
  }
  return response.data
}

export const logout = () => {
  setAuthToken(null)
}

export const getProfile = async (): Promise<User> => {
  const response = await api.get<User>('/api/auth/me')
  return response.data
}

export const updateProfile = async (data: { firstName: string; lastName: string }): Promise<{ message: string; user: User }> => {
  const response = await api.put('/api/auth/profile', data)
  return response.data
}

// Shopping Lists
export const getShoppingLists = async (): Promise<ShoppingList[]> => {
  const response = await api.get<ShoppingList[]>('/api/shopping-lists')
  return response.data
}

export const getShoppingList = async (id: number): Promise<ShoppingList> => {
  const response = await api.get<ShoppingList>(`/api/shopping-lists/${id}`)
  return response.data
}

export const createShoppingList = async (data: { storeId: number; name: string }): Promise<ShoppingList> => {
  const response = await api.post<ShoppingList>('/api/shopping-lists', data)
  return response.data
}

export const updateShoppingList = async (id: number, data: { name?: string; storeId?: number; status?: string }): Promise<ShoppingList> => {
  const response = await api.put<ShoppingList>(`/api/shopping-lists/${id}`, data)
  return response.data
}

export const deleteShoppingList = async (id: number): Promise<void> => {
  await api.delete(`/api/shopping-lists/${id}`)
}

export const completeShoppingList = async (id: number): Promise<ShoppingList> => {
  const response = await api.post<ShoppingList>(`/api/shopping-lists/${id}/complete`)
  return response.data
}

export const getListItems = async (listId: number): Promise<Item[]> => {
  const response = await api.get<any>(`/api/shopping-lists/${listId}/items`)
  // Backend returns grouped format, flatten it
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

export const addListItem = async (listId: number, data: { name: string; notes?: string }): Promise<Item> => {
  const response = await api.post<Item>(`/api/shopping-lists/${listId}/items`, data)
  return response.data
}

export default api
