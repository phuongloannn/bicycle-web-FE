// src/contexts/CartContext.tsx
'use client';
import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

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
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  sessionId: string | null;
  loading: boolean;
}

type CartAction =
  | { type: 'SET_CART'; payload: { items: CartItem[] } }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { cartItemId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: { loading: boolean } };

const CartContext = createContext<{
  state: CartState;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCart: () => Promise<void>;
  checkout: (customerInfo: any) => Promise<any>;
} | null>(null);

const CART_STORAGE_KEY = 'local_cart_items';

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      const items = action.payload.items || [];
      const total = items.reduce((sum, item) => sum + item.total, 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      return { ...state, items, total, itemCount, loading: false };

    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      let newItems;
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex ? action.payload : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.total, 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
        loading: false
      };

    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.cartItemId
          ? { ...item, quantity: action.payload.quantity, total: action.payload.quantity * item.price }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.total, 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };

    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload.cartItemId);
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + item.total, 0),
        itemCount: filteredItems.reduce((sum, item) => sum + item.quantity, 0)
      };

    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0, sessionId: null, loading: false };

    case 'SET_LOADING':
      return { ...state, loading: action.payload.loading };

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
    loading: false
  });

  // ✅ Load từ localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      const cartData = JSON.parse(savedCart).map((item: any) => ({
        ...item,
        price: Number(item.price) || 0,
        total: Number(item.total) || 0
      }));
      dispatch({ type: 'SET_CART', payload: { items: cartData } });
    }
  }, []);

  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [state.items]);

  const processImageUrl = (imageUrl?: string): string => {
    const placeholder = '/images/placeholder-product.jpg';
    if (!imageUrl) return placeholder;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `http://localhost:3000${imageUrl}`;
    return `http://localhost:3000/${imageUrl}`;
  };

  // ✅ Checkout sửa lại
  const checkout = async (customerInfo: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { loading: true } });

      if (state.items.length === 0) throw new Error('Giỏ hàng trống');
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.shippingAddress) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      const calculatedTotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      if (calculatedTotal === 0) throw new Error('Lỗi tính toán tổng tiền');


let customerId: string | null = null;

// ✅ Kiểm tra customer theo email
const existCustomerResponse = await fetch(`http://localhost:3000/customers/bymail/${customerInfo.email}`);
if (existCustomerResponse.ok) {
  const existingCustomer = await existCustomerResponse.json();
  const ec = existingCustomer?.data ?? existingCustomer;

  if (ec && typeof ec.id === 'number') {
    customerId = ec.id.toString();

    // ✅ Cập nhật thông tin nếu đã tồn tại
    await fetch(`http://localhost:3000/customers/${customerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.shippingAddress
      })
    });
  }
}

// ✅ Nếu chưa có customerId → tạo mới
if (!customerId) {
  const newCustomerResponse = await fetch('http://localhost:3000/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone,
      address: customerInfo.shippingAddress
    })
  });

  const newCustomer = await newCustomerResponse.json();
  customerId = newCustomer?.data?.id?.toString();
}

      // ✅ Tạo order
      const orderData = {
        customerId,
        items: state.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price
        })),
        shippingAddress: customerInfo.shippingAddress,
        billingAddress: customerInfo.billingAddress || customerInfo.shippingAddress,
        paymentMethod: customerInfo.paymentMethod || 'COD'
      };

      const orderResponse = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        throw new Error(`Failed to create order: ${orderResponse.status} - ${errorText}`);
      }

      const createdOrder = await orderResponse.json();

      // ✅ Clear cart
      dispatch({ type: 'CLEAR_CART' });
      localStorage.removeItem(CART_STORAGE_KEY);

      return {
        success: true,
        message: 'Đặt hàng thành công!',
        orderId: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        order: createdOrder,
        total: calculatedTotal,
        customerId
      };
    } catch (error: any) {
      throw new Error(error.message || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { cartItemId } });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart: async (product: Product, quantity?: number) => {
          try {
            dispatch({ type: 'SET_LOADING', payload: { loading: true } });
            if (product.quantity < (quantity || 1)) {
              throw new Error(`Chỉ còn ${product.quantity} sản phẩm trong kho`);
            }
            const productPrice = Number(product.price) || 0;
            const existingItem = state.items.find(item => item.productId === product.id);
            let cartItem: CartItem;
            if (existingItem) {
              const newQuantity = existingItem.quantity + (quantity || 1);
              cartItem = {
                ...existingItem,
                quantity: newQuantity,
                total: productPrice * newQuantity
              };
            } else {
              cartItem = {
                id: Date.now() + Math.random(),
                productId: product.id,
                productName: product.name,
                quantity: quantity || 1,
                price: productPrice,
                total: productPrice * (quantity || 1),
                image: processImageUrl(product.image || product.image_url || product.imageUrl),
                stock: product.quantity
              };
            }
            dispatch({ type: 'ADD_ITEM', payload: cartItem });
          } catch (error) {
            console.error('❌ [CartContext] addToCart ERROR:', error);
            throw error;
          } finally {
            dispatch({ type: 'SET_LOADING', payload: { loading: false } });
          }
        },
        updateCartItem: async (cartItemId: number, quantity: number) => {
          if (quantity <= 0) {
            await removeFromCart(cartItemId);
            return;
          }
          dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
        },
        removeFromCart,
        clearCart: async () => {
          dispatch({ type: 'CLEAR_CART' });
          localStorage.removeItem(CART_STORAGE_KEY);
        },
        getCart: async () => Promise.resolve(),
        checkout
      }}
    >
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