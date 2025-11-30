// src/contexts/CartContext.tsx
'use client';
import { createContext, useContext, useReducer, ReactNode, useEffect, useCallback, useState } from 'react';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  stock: number;
  category: string;
  image_url?: string;
  imageUrl?: string;
  image?: string;
  photo?: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  image: string;
  stock: number;
  product?: Product;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  sessionId: string | null;
  loading: boolean;
  products: Record<number, Product>;
}

type CartAction = 
  | { type: 'SET_CART'; payload: { items: CartItem[], sessionId?: string } }
  | { type: 'ADD_ITEM'; payload: { productId?: number; product?: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { cartItemId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_SESSION'; payload: { sessionId: string } }
  | { type: 'SET_LOADING'; payload: { loading: boolean } };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (productId: number | Product, quantity: number) => Promise<void>;
  updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCart: () => Promise<void>;
  getCartData: () => Promise<void>;
  checkout: (customerInfo: any) => Promise<any>;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      const items = action.payload.items || [];
      const total = items.reduce((sum, item) => sum + item.total, 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items,
        total,
        itemCount,
        sessionId: action.payload.sessionId || state.sessionId,
        loading: false
      };

    case 'SET_SESSION':
      return {
        ...state,
        sessionId: action.payload.sessionId
      };

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
        sessionId: state.sessionId,
        loading: false,
        products: {}
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload.loading
      };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    sessionId: null,
    loading: false,
    products: {}
  });

  const API_BASE_URL = "/api";

  // ✅ HÀM TẬP TRUNG - CHỈ TẠO SESSION ID Ở 1 CHỖ
  const getOrCreateSessionId = useCallback((): string => {
    let sessionId = localStorage.getItem('cartSessionId');
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('cartSessionId', sessionId);
      console.log('🆕 [Session] Created new session:', sessionId);
    }
    
    return sessionId;
  }, []);

  // ✅ Khởi tạo session khi component mount
  useEffect(() => {
    const initializeCart = async () => {
      const sessionId = getOrCreateSessionId();
      dispatch({ type: 'SET_SESSION', payload: { sessionId } });
      await getCart();
    };

    initializeCart();
  }, [getOrCreateSessionId]);

  // ✅ Hàm xử lý image URL
  const processImageUrl = (imageUrl: string | undefined): string => {
    const placeholder = '/images/placeholder-product.jpg';
    
    if (!imageUrl) return placeholder;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/uploads/')) return `http://localhost:3000${imageUrl}`;
    if (!imageUrl.includes('/')) return `/uploads/${imageUrl}`;
    
    return `http://localhost:3000${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
  };

  // ✅ Lấy giỏ hàng từ API
  const getCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { loading: true } });
      const sessionId = getOrCreateSessionId();

      const response = await fetch(`${API_BASE_URL}/guest/cart`, {
        method: 'GET',
        headers: {
          'X-Session-ID': sessionId,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          const cartItems = Array.isArray(result.data) ? result.data : (result.data.items || []);
          
          const processedItems = cartItems.map((item: any) => {
            let imageUrl = '';
            
            if (item.image) imageUrl = item.image;
            else if (item.product?.image) imageUrl = item.product.image;
            else if (item.productImage) imageUrl = item.productImage;
            else if (item.image_url) imageUrl = item.image_url;
            else if (item.imageUrl) imageUrl = item.imageUrl;
            else if (item.product?.image_url) imageUrl = item.product.image_url;
            else if (item.product?.imageUrl) imageUrl = item.product.imageUrl;
            else imageUrl = '/images/placeholder-product.jpg';

            return {
              id: item.id,
              productId: item.productId || item.product?.id,
              productName: item.product?.name || item.productName,
              quantity: item.quantity,
              price: item.price || item.product?.price || 0,
              total: item.total || (item.quantity * (item.price || item.product?.price || 0)),
              image: processImageUrl(imageUrl),
              stock: item.stock || item.product?.stock || 0,
              product: item.product
            };
          });

          dispatch({ 
            type: 'SET_CART', 
            payload: { 
              items: processedItems,
              sessionId: sessionId
            } 
          });
        }
      } else {
        console.warn('[CartContext] Get cart failed, using empty cart');
        dispatch({ 
          type: 'SET_CART', 
          payload: { 
            items: [],
            sessionId: sessionId
          } 
        });
      }

    } catch (error) {
      console.error('[CartContext] Error fetching cart:', error);
      const sessionId = getOrCreateSessionId();
      dispatch({ 
        type: 'SET_CART', 
        payload: { 
          items: [],
          sessionId: sessionId
        } 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    }
  }, [getOrCreateSessionId]);

  // ✅ Thêm vào giỏ hàng
  const addToCart = async (productInput: number | Product, quantity: number = 1) => {
    try {
      const productId = typeof productInput === 'number' ? productInput : productInput.id;
      const sessionId = getOrCreateSessionId();

      const response = await fetch(`${API_BASE_URL}/guest/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId
        },
        body: JSON.stringify({ productId, quantity })
      });

      if (response.ok) {
        await getCart(); // Refresh cart
      } else {
        console.warn('[CartContext] Add to cart API failed, using local fallback');
        await handleLocalAddToCart(productInput, quantity, sessionId);
      }

    } catch (error) {
      console.error('[CartContext] addToCart ERROR:', error);
      const sessionId = getOrCreateSessionId();
      await handleLocalAddToCart(productInput, quantity, sessionId);
    }
  };

  // ✅ Hàm fallback: thêm vào cart local
  const handleLocalAddToCart = async (productInput: number | Product, quantity: number, sessionId: string) => {
    const product = typeof productInput === 'object' ? productInput : null;
    if (product) {
      const existingItem = state.items.find(item => item.productId === product.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.productId === product.id
            ? { 
                ...item, 
                quantity: item.quantity + quantity,
                total: (item.quantity + quantity) * item.price
              }
            : item
        );
        
        dispatch({ 
          type: 'SET_CART', 
          payload: { 
            items: updatedItems,
            sessionId: sessionId
          } 
        });
      } else {
        const newItem: CartItem = {
          id: Date.now(),
          productId: product.id,
          productName: product.name,
          quantity: quantity,
          price: product.price,
          total: product.price * quantity,
          image: processImageUrl(product.image || product.image_url || product.imageUrl),
          stock: product.stock || product.quantity,
          product: product
        };
        
        dispatch({ 
          type: 'SET_CART', 
          payload: { 
            items: [...state.items, newItem],
            sessionId: sessionId
          } 
        });
      }
    }
  };

  // ✅ Cập nhật số lượng
  const updateCartItem = async (cartItemId: number, quantity: number) => {
    try {
      const sessionId = getOrCreateSessionId();

      const response = await fetch(`${API_BASE_URL}/guest/cart/${cartItemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId
        },
        body: JSON.stringify({ quantity })
      });

      if (response.ok) {
        await getCart();
      } else {
        console.warn('[CartContext] Update cart item API failed, updating locally');
        const updatedItems = state.items.map(item =>
          item.id === cartItemId
            ? { 
                ...item, 
                quantity: quantity,
                total: quantity * item.price
              }
            : item
        );
        
        dispatch({ 
          type: 'SET_CART', 
          payload: { 
            items: updatedItems,
            sessionId: sessionId
          } 
        });
      }

    } catch (error) {
      console.error('[CartContext] Error updating cart:', error);
    }
  };

  // ✅ Xóa item
  const removeFromCart = async (cartItemId: number) => {
    try {
      const sessionId = getOrCreateSessionId();

      const response = await fetch(`${API_BASE_URL}/guest/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'X-Session-ID': sessionId
        }
      });

      if (response.ok) {
        await getCart();
      } else {
        console.warn('[CartContext] Remove from cart API failed, removing locally');
        const filteredItems = state.items.filter(item => item.id !== cartItemId);
        
        dispatch({ 
          type: 'SET_CART', 
          payload: { 
            items: filteredItems,
            sessionId: sessionId
          } 
        });
      }

    } catch (error) {
      console.error('[CartContext] Error removing item:', error);
    }
  };

  // ✅ Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    try {
      const sessionId = getOrCreateSessionId();

      await fetch(`${API_BASE_URL}/guest/cart`, {
        method: 'DELETE',
        headers: {
          'X-Session-ID': sessionId,
          'Content-Type': 'application/json'
        }
      });

      dispatch({ type: 'CLEAR_CART' });
      
    } catch (error) {
      console.error('[CartContext] Error clearing cart:', error);
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  // ✅ CHECKOUT FUNCTION - ĐÃ SỬA VỚI VALIDATION
  const checkout = async (customerInfo: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { loading: true } });
      const sessionId = getOrCreateSessionId();
      
      console.log('🔐 [CartContext] checkout - Session:', sessionId, 'Local items:', state.items);

      // ✅ 1. KIỂM TRA CART TRONG LOCAL STATE
      if (state.items.length === 0) {
        throw new Error('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
      }

      // ✅ 2. ĐỒNG BỘ VỚI API - ĐẢM BẢO CART TRONG API CÓ DỮ LIỆU
      console.log('🔄 [CartContext] Verifying API cart before checkout...');
      
      const cartResponse = await fetch(`${API_BASE_URL}/guest/cart`, {
        headers: { 'X-Session-ID': sessionId }
      });

      let apiCart;
      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        apiCart = cartData.data;
        console.log('📦 [CartContext] API cart before checkout:', apiCart);
      }

      // ✅ 3. NẾU API CART TRỐNG, THÊM LẠI SẢN PHẨM TỪ LOCAL STATE
      if (!apiCart || !apiCart.items || apiCart.items.length === 0) {
        console.log('🔄 [CartContext] API cart is empty, restoring from local state...');
        
        // Thêm lại tất cả sản phẩm từ local state vào API
        for (const item of state.items) {
          await fetch(`${API_BASE_URL}/guest/cart/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Session-ID': sessionId
            },
            body: JSON.stringify({ 
              productId: item.productId, 
              quantity: item.quantity 
            })
          });
        }
        
        console.log('✅ [CartContext] Restored cart to API from local state');
        
        // Đợi một chút để API xử lý
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // ✅ 4. THỰC HIỆN CHECKOUT
      console.log('🎯 [CartContext] Proceeding with checkout...');
      const response = await fetch(`${API_BASE_URL}/guest/cart/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId
        },
        body: JSON.stringify({
          ...customerInfo,
          items: state.items, // Gửi cả items để backup
          total: state.total
        })
      });

      console.log('[CartContext] Checkout response status:', response.status);

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || errorResult.error || 'Checkout failed');
      }

      const result = await response.json();
      console.log('✅ [CartContext] Checkout SUCCESS:', result);

      // ✅ 5. XÓA CART SAU KHI CHECKOUT THÀNH CÔNG
      dispatch({ type: 'CLEAR_CART' });
      localStorage.removeItem('cartSessionId');

      return result;

    } catch (error) {
      console.error('❌ [CartContext] checkout ERROR:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    }
  };

  // ✅ Alias function cho compatibility
  const getCartData = useCallback(async () => {
    await getCart();
  }, [getCart]);

  return (
    <CartContext.Provider value={{
      state,
      dispatch,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      getCart,
      getCartData,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}