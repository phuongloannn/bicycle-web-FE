// src/lib/api/categories.ts
import { apiClient } from "./client";

export interface Category {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
  is_active: number;
  parent: Category | null;
  children: Category[];
  created_at: string;
  updated_at: string;

  // Optional camelCase aliases if backend later changes format
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

// ✅ GET all categories
export const getCategories = () => apiClient.get<Category[]>("/categories");

// ✅ GET category by id
export const getCategoryById = (id: number) =>
  apiClient.get<Category>(`/categories/${id}`);

export interface CreateCategoryDto {
  name: string;
  slug?: string;
  thumbnail?: string | null;
  is_active?: number;
  parent_id?: number | null;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

// ✅ CREATE category
export const createCategory = (data: CreateCategoryDto) =>
  apiClient.post<Category>("/categories", data);

// ✅ UPDATE category
export const updateCategory = (id: number, data: UpdateCategoryDto) =>
  apiClient.patch<Category>(`/categories/${id}`, data);

// ✅ DELETE category
export const deleteCategory = (id: number) =>
  apiClient.delete(`/categories/${id}`);

// ✅ Aggregated API object
export const categoriesApi = {
  getAll: getCategories,
  getById: getCategoryById,
  create: createCategory,
  update: updateCategory,
  delete: deleteCategory,
};


