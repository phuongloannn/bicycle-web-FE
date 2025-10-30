const API_BASE_URL = 'http://127.0.0.1:3000';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl?: string;        // 🔥 THÊM
  imageFilename?: string; 
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category?: string;
  imageUrl?: string;        // 🔥 THÊM
  imageFilename?: string; 
}

// 🔥 THÊM SEARCH API
export const searchProducts = async (query: string): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search products');
  }
  return response.json();
};

// 🔥 UPLOAD IMAGE API
export const uploadProductImage = async (file: File): Promise<{ url: string; filename: string }> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch(`${API_BASE_URL}/upload/product-image`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  
  return response.json();
};

export interface UpdateProductDto extends Partial<CreateProductDto> {}

// GET all products
export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

// GET product by ID
export const getProductById = async (id: number): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
};

// CREATE product
export const createProduct = async (data: CreateProductDto): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create product');
  }
  return response.json();
};

// UPDATE product
export const updateProduct = async (id: number, data: UpdateProductDto): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  return response.json();
};

// DELETE product
export const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
};