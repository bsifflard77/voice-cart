// Backend API types

export interface Store {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface Department {
  id: number
  store_id: number
  name: string
  display_order: number
  created_at: string
  updated_at: string
  store_name?: string
}

export interface Item {
  id: number
  store_id: number
  department_id: number
  name: string
  status: 'active' | 'picked_up' | 'deleted'
  added_at: string
  picked_up_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
  department_name?: string
  store_name?: string
  ai_suggested_department?: string
}

export interface DepartmentGroup {
  department_id: number
  department_name: string
  items: Item[]
}

export interface CreateItemRequest {
  storeId: number
  name: string
  notes?: string
  departmentId?: number
}

export interface UpdateItemRequest {
  name?: string
  notes?: string
  departmentId?: number
  status?: 'active' | 'picked_up' | 'deleted'
}
