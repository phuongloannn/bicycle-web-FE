// src/lib/api/products.ts
import { apiClient } from "./client";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  stock: number;
  category: string;
  image_url?: string;
  image_filename?: string;
  // ✅ THÊM CAMELCASE FIELDS
  imageUrl?: string;
  imageFilename?: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ GET all products
export const getProducts = () =>
  apiClient.get<Product[]>("/products");

// ✅ GET product by id
export const getProductById = (id: number) =>
  apiClient.get<Product>(`/products/${id}`);

// ✅ SEARCH
export const searchProducts = (query: string) =>
  apiClient.get<Product[]>(`/products?q=${encodeURIComponent(query)}`);

// ✅ CREATE product
export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category?: string;
  image_url?: string;
  image_filename?: string;
  // ✅ THÊM CAMELCASE FIELDS
  imageUrl?: string;
  imageFilename?: string;
}

export const createProduct = (data: CreateProductDto) =>
  apiClient.post<Product>("/products", data);

// ✅ UPDATE
export interface UpdateProductDto extends Partial<CreateProductDto> {}

export const updateProduct = (id: number, data: UpdateProductDto) =>
  apiClient.patch<Product>(`/products/${id}`, data);

// ✅ DELETE
export const deleteProduct = (id: number) =>
  apiClient.delete(`/products/${id}`);

// ✅ UPLOAD IMAGE
export const uploadProductImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  return apiClient.post<{ url: string; filename: string }>(
    "/products/upload",
    formData as any
  );
};

// ✅ AGGREGATED API OBJECT
export const productsApi = {
  getAll: getProducts,
  getById: getProductById,
  search: searchProducts,
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
  uploadImage: uploadProductImage,
};