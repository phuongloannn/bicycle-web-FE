// src/lib/api/categories.ts
import { apiClient } from "./client";

export interface Category {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
  // Backend lưu tinyint nhưng map ra boolean
  is_active: boolean;
  parent: Category | null;
  children: Category[];
  created_at: string | Date;
  updated_at: string | Date;

  // Optional camelCase aliases nếu sau này backend đổi format
  createdAt?: string | Date;
  updatedAt?: string | Date;
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
  // Gửi boolean để khớp với DTO backend
  is_active?: boolean;
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

