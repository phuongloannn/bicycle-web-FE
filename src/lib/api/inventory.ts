// src/lib/api/inventory.ts
import { apiClient } from "./client";
import type { Product } from "./products";
import type { Category } from "./categories";

export interface InventoryItem {
  id: number;
  product: Product;
  category: Category | null;
  quantity: number;
  reserved: number;
  min_stock: number;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInventoryDto {
  product_id: number;
  category_id?: number | null;
  quantity: number;
  reserved?: number;
  min_stock?: number;
  location?: string;
}

export interface UpdateInventoryDto extends Partial<CreateInventoryDto> {}

// GET all inventory
export const getInventory = () =>
  apiClient.get<InventoryItem[]>("/inventory");

// GET inventory by product
export const getInventoryByProduct = (productId: number) =>
  apiClient.get<InventoryItem[]>(`/inventory?productId=${productId}`);

// CREATE
export const createInventoryItem = (data: CreateInventoryDto) =>
  apiClient.post<InventoryItem>("/inventory", data);

// UPDATE
export const updateInventoryItem = (id: number, data: UpdateInventoryDto) =>
  apiClient.patch<InventoryItem>(`/inventory/${id}`, data);

// ADJUST quantity
export const adjustInventoryQuantity = (id: number, delta: number) =>
  apiClient.patch<InventoryItem>(`/inventory/${id}/adjust?delta=${delta}`);

// DELETE
export const deleteInventoryItem = (id: number) =>
  apiClient.delete(`/inventory/${id}`);

export const inventoryApi = {
  getAll: getInventory,
  getByProduct: getInventoryByProduct,
  create: createInventoryItem,
  update: updateInventoryItem,
  adjust: adjustInventoryQuantity,
  delete: deleteInventoryItem,
};


