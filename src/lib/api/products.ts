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
// ✅ UPLOAD IMAGE - VỚI ERROR HANDLING
export const uploadProductImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    console.log('📤 Uploading image:', file.name, file.size);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${API_BASE_URL}/upload/product-image`, {
      method: 'POST',
      body: formData,
      // ❌ KHÔNG THÊM headers - browser tự set
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Upload success:', result);
    return result;
    
  } catch (error) {
    console.error('💥 Upload error:', error);
    throw error;
  }
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