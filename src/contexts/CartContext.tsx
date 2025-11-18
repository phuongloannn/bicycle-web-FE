// src/contexts/CartContext.tsx
'use client';
import { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';

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

// ✅ LOCAL STORAGE KEYS - CHỈ CHO CART
const CART_STORAGE_KEY = 'local_cart_items';

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
        loading: false
      };

    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      let newItems;
      
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = state.items.map((item, index) => 
          index === existingItemIndex ? action.payload : item
        );
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }
      
      const newTotal = newItems.reduce((sum, item) => sum + item.total, 0);
      const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
        loading: false
      };

    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.cartItemId
          ? { 
              ...item, 
              quantity: action.payload.quantity,
              total: action.payload.quantity * item.price
            }
          : item
      );
      
      const updatedTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const updatedItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: updatedItems,
        total: updatedTotal,
        itemCount: updatedItemCount
      };

    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload.cartItemId);
      const filteredTotal = filteredItems.reduce((sum, item) => sum + item.total, 0);
      const filteredItemCount = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: filteredItems,
        total: filteredTotal,
        itemCount: filteredItemCount
      };

    case 'CLEAR_CART':
      return { 
        items: [], 
        total: 0, 
        itemCount: 0, 
        sessionId: null,
        loading: false
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
    loading: false
  });

  // ✅ LOAD CART FROM LOCALSTORAGE ON MOUNT
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          // ✅ ĐẢM BẢO TẤT CẢ PRICE VÀ TOTAL LÀ NUMBER
          const processedCartData = cartData.map((item: any) => ({
            ...item,
            price: Number(item.price) || 0,
            total: Number(item.total) || 0
          }));
          dispatch({ type: 'SET_CART', payload: { items: processedCartData } });
          console.log('📦 Loaded cart from localStorage:', processedCartData.length, 'items');
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    };

    loadCartFromStorage();
  }, []);

  // ✅ SAVE CART TO LOCALSTORAGE WHENEVER IT CHANGES
  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [state.items]);

  // ✅ Hàm xử lý image URL
  const processImageUrl = (imageUrl: string | undefined): string => {
    const placeholder = '/images/placeholder-product.jpg';
    
    if (!imageUrl) return placeholder;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `http://localhost:3000${imageUrl}`;
    
    return `http://localhost:3000/${imageUrl}`;
  };

  // ✅ THÊM VÀO GIỎ HÀNG - LẤY DATA TỪ DATABASE
  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { loading: true } });
      
      console.log('🛒 [CartContext] Adding to cart from database:', { 
        product: product.name, 
        quantity,
        price: product.price,
        stock: product.quantity // ✅ Dùng quantity từ database
      });

      // Kiểm tra stock từ database
      if (product.quantity < quantity) {
        throw new Error(`Chỉ còn ${product.quantity} sản phẩm trong kho`);
      }

      // ✅ ĐẢM BẢO PRICE LÀ NUMBER VÀ LẤY TỪ DATABASE
      const productPrice = Number(product.price) || 0;
      
      // Tìm item hiện tại để cập nhật số lượng
      const existingItem = state.items.find(item => item.productId === product.id);
      let cartItem: CartItem;

      if (existingItem) {
        // Cập nhật số lượng
        const newQuantity = existingItem.quantity + quantity;
        cartItem = {
          ...existingItem,
          quantity: newQuantity,
          total: productPrice * newQuantity
        };
      } else {
        // Tạo mới với data từ database
        cartItem = {
          id: Date.now() + Math.random(), // Unique ID
          productId: product.id,
          productName: product.name, // ✅ Lấy từ database
          quantity: quantity,
          price: productPrice, // ✅ Lấy từ database
          total: productPrice * quantity, // ✅ Tính toán chính xác
          image: processImageUrl(product.image || product.image_url || product.imageUrl),
          stock: product.quantity // ✅ Lấy quantity từ database
        };
      }

      // Thêm vào state
      dispatch({ type: 'ADD_ITEM', payload: cartItem });

      console.log('✅ [CartContext] Added to cart successfully');

    } catch (error) {
      console.error('❌ [CartContext] addToCart ERROR:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    }
  };

  // ✅ CẬP NHẬT SỐ LƯỢNG
  const updateCartItem = async (cartItemId: number, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(cartItemId);
        return;
      }

      console.log('📝 [CartContext] Updating cart item:', { cartItemId, quantity });
      
      dispatch({ 
        type: 'UPDATE_QUANTITY', 
        payload: { cartItemId, quantity } 
      });

    } catch (error) {
      console.error('❌ [CartContext] updateCartItem ERROR:', error);
      throw error;
    }
  };

  // ✅ XÓA ITEM KHỎI GIỎ HÀNG
  const removeFromCart = async (cartItemId: number) => {
    try {
      console.log('🗑️ [CartContext] Removing item:', cartItemId);
      
      dispatch({ 
        type: 'REMOVE_ITEM', 
        payload: { cartItemId } 
      });

    } catch (error) {
      console.error('❌ [CartContext] removeFromCart ERROR:', error);
      throw error;
    }
  };

  // ✅ XÓA TOÀN BỘ GIỎ HÀNG
  const clearCart = async () => {
    try {
      console.log('🧹 [CartContext] Clearing cart');
      
      dispatch({ type: 'CLEAR_CART' });
      localStorage.removeItem(CART_STORAGE_KEY);

    } catch (error) {
      console.error('❌ [CartContext] clearCart ERROR:', error);
      throw error;
    }
  };

  // ✅ LẤY GIỎ HÀNG (for compatibility)
  const getCart = async () => {
    // Already loaded from localStorage on mount
    return Promise.resolve();
  };

// ✅ CHECKOUT - KIỂM TRA CUSTOMER ĐÃ TỒN TẠI + TẠO CUSTOMER MỚI + ORDER + UPDATE STOCK
const checkout = async (customerInfo: any) => {
  try {
    dispatch({ type: 'SET_LOADING', payload: { loading: true } });
    
    console.log('💰 [CartContext] Guest Checkout - Kiểm tra và tạo customer');

    // VALIDATION
    if (state.items.length === 0) {
      throw new Error('Giỏ hàng trống');
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.shippingAddress) {
      throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc (tên, email, số điện thoại, địa chỉ giao hàng)');
    }

    // ✅ 1. TÍNH TOTAL TRƯỚC
    const calculatedTotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log('💰 Calculated total:', calculatedTotal);

    if (calculatedTotal === 0) {
      throw new Error('Lỗi tính toán tổng tiền. Vui lòng thử lại.');
    }

    let customerId: string;

// ✅ 2. KIỂM TRA CUSTOMER ĐÃ TỒN TẠI THEO EMAIL
console.log(`🔍 Kiểm tra customer tồn tại với email: ${customerInfo.email}`);
const existCustomerResponse = await fetch(`http://localhost:3000/customers/bymail/${customerInfo.email}`, {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
});

if (existCustomerResponse.ok) {
  let existingCustomer: any;
  try {
    existingCustomer = await existCustomerResponse.json();
  } catch {
    throw new Error('Phản hồi customer không phải JSON hợp lệ');
  }

  console.log('📥 Customer API response:', existingCustomer);

  // Chuẩn hóa dữ liệu: nếu API trả về { data: {...} } thì lấy data, nếu trả về {...} thì lấy trực tiếp
  const ec = existingCustomer?.data ?? existingCustomer;

  if (!ec || !ec.id) {
    throw new Error('Không thể lấy thông tin khách hàng từ server');
  }

  customerId = ec.id;
  console.log('✅ Sử dụng customer đã tồn tại:', ec.name, 'ID:', customerId);

  // ✅ Cập nhật thông tin customer nếu cần
  await fetch(`http://localhost:3000/customers/${customerId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: customerInfo.name,
      phone: customerInfo.phone,
      address: customerInfo.shippingAddress
    })
  });

      // ✅ CẬP NHẬT THÔNG TIN CUSTOMER NẾU CẦN
      console.log('🔄 Cập nhật thông tin customer nếu có thay đổi...');
      await fetch(`http://localhost:3000/customers/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.shippingAddress
        })
      });
      
    } else if (existCustomerResponse.status === 404) {
      // ✅ CUSTOMER CHƯA TỒN TẠI - TẠO CUSTOMER MỚI
      console.log('🔄 Tạo customer mới cho guest...');
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

      if (!newCustomerResponse.ok) {
        throw new Error('Failed to create customer');
      }

      const newCustomer = await newCustomerResponse.json();
      customerId = newCustomer.data.id;
      console.log('✅ Created new guest customer:', customerInfo.name, 'ID:', customerId);
    } else {
      // ❌ LỖI KHI KIỂM TRA CUSTOMER
      throw new Error('Không thể kiểm tra thông tin khách hàng');
    }

    // ✅ 3. TẠO ORDER VỚI CUSTOMER ID
    const orderData = {
      customerId: customerId,
      items: state.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price
      })),
      
      shippingAddress: customerInfo.shippingAddress,
      billingAddress: customerInfo.billingAddress || customerInfo.shippingAddress,
      paymentMethod: customerInfo.paymentMethod || 'COD'
    };

    console.log('🔄 Creating order with total:', calculatedTotal);
    
    // ✅ GỬI REQUEST TẠO ORDER
    const orderResponse = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    // ✅ THÊM DEBUG CHI TIẾT
    console.log('🔍 [DEBUG] Order Response Status:', orderResponse.status);
    console.log('🔍 [DEBUG] Order Response OK:', orderResponse.ok);

    if (!orderResponse.ok) {
      // ✅ LẤY THÔNG TIN LỖI CHI TIẾT
      const errorText = await orderResponse.text();
      console.error('❌ [DEBUG] Order Error Response:', errorText);
      console.error('❌ [DEBUG] Order Data Sent:', orderData);
      
      throw new Error(`Failed to create order: ${orderResponse.status} - ${errorText}`);
    }

    const createdOrder = await orderResponse.json();
    console.log('✅ Order created:', createdOrder);

    // ✅ 4. CẬP NHẬT STOCK SẢN PHẨM TRONG DATABASE
    console.log('🔄 Updating product stocks...');
    for (const item of state.items) {
      try {
        // Lấy thông tin sản phẩm hiện tại từ database
        const productResponse = await fetch(`http://localhost:3000/products/${item.productId}`);
        const currentProduct = await productResponse.json();
        
        // Tính stock mới
        const newStock = currentProduct.quantity - item.quantity;
        if (newStock < 0) {
          throw new Error(`Sản phẩm không đủ hàng`);
        }

        // Cập nhật stock trong database (PATCH)
        await fetch(`http://localhost:3000/products/${item.productId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            quantity: newStock
          })
        });
        console.log(`✅ Stock updated: ${currentProduct.quantity} → ${newStock}`);
      } catch (stockError) {
        console.error(`❌ Stock update failed for product ${item.productId}:`, stockError);
        throw new Error(`Cập nhật kho thất bại cho sản phẩm`);
      }
    }

    // ✅ 5. XÓA GIỎ HÀNG SAU KHI THÀNH CÔNG
    await clearCart();

    return {
      success: true,
      message: 'Đặt hàng thành công! Cảm ơn bạn đã mua sắm.',
      orderId: createdOrder.id,
      orderNumber: createdOrder.orderNumber,
      order: createdOrder,
      total: calculatedTotal,
      customerId: customerId
    };

  } catch (error: any) {
    console.error('❌ [CartContext] checkout ERROR:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đặt hàng';
    throw new Error(errorMessage);
  } finally {
    dispatch({ type: 'SET_LOADING', payload: { loading: false } });
  }
};

  return (
    <CartContext.Provider value={{
      state,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      getCart,
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