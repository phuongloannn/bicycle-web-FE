// src/contexts/CartContext.tsx
'use client';
import { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';

// 🔥 UPDATED: ADD ACCESSORY INTERFACE
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number; // For products
  stock: number; // For products  
  category: string;
  image_url?: string;
  imageUrl?: string;
  image?: string;
  photo?: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

// 🔥 NEW: ACCESSORY INTERFACE
export interface Accessory {
  id: number;
  name: string;
  description: string;
  price: number;
  in_stock: number; // For accessories
  category: string;
  compatible_with: string;
  image_url: string | null;
  image_filename: string | null;
  created_at: string;
  updated_at: string;
}

// 🔥 UPDATED: CART ITEM WITH ITEM TYPE
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  image: string;
  stock: number;
  itemType: 'product' | 'accessory'; // 🔥 NEW: TO DISTINGUISH PRODUCT VS ACCESSORY
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
  addToCart: (item: Product | Accessory, quantity?: number, itemType?: 'product' | 'accessory') => Promise<void>;
  updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCart: () => Promise<void>;
  checkout: (customerInfo: any) => Promise<any>;
  processPayment: (orderId: string, paymentMethod: string, paymentData?: any) => Promise<any>;
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
      const existingItemIndex = state.items.findIndex(item => 
        item.id === action.payload.id && item.itemType === action.payload.itemType
      );
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
            total: Number(item.total) || 0,
            itemType: item.itemType || 'product' // 🔥 DEFAULT TO PRODUCT FOR BACKWARD COMPATIBILITY
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
  const processImageUrl = (imageUrl: string | undefined | null): string => {
    const placeholder = '/images/placeholder-product.jpg';
    
    if (!imageUrl) return placeholder;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `http://localhost:3000${imageUrl}`;
    
    return `http://localhost:3000/${imageUrl}`;
  };

  // ✅ UPDATED: ADD TO CART - SUPPORT BOTH PRODUCTS AND ACCESSORIES
  const addToCart = async (item: Product | Accessory, quantity: number = 1, itemType: 'product' | 'accessory' = 'product') => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { loading: true } });
      
      console.log('🛒 [CartContext] Adding to cart:', { 
        name: item.name, 
        quantity,
        price: item.price,
        itemType,
        stock: 'quantity' in item ? item.quantity : item.in_stock // 🔥 HANDLE BOTH STOCK FIELDS
      });

      // 🔥 CHECK STOCK BASED ON ITEM TYPE
      let availableStock: number;
      if (itemType === 'product') {
        availableStock = (item as Product).quantity;
      } else {
        availableStock = (item as Accessory).in_stock;
      }

      if (availableStock < quantity) {
        throw new Error(`Chỉ còn ${availableStock} sản phẩm trong kho`);
      }

      // ✅ ĐẢM BẢO PRICE LÀ NUMBER
      const itemPrice = Number(item.price) || 0;
      
      // Tìm item hiện tại để cập nhật số lượng
      const existingItem = state.items.find(cartItem => 
        cartItem.productId === item.id && cartItem.itemType === itemType
      );
      
      let cartItem: CartItem;

      if (existingItem) {
        // Cập nhật số lượng
        const newQuantity = existingItem.quantity + quantity;
        cartItem = {
          ...existingItem,
          quantity: newQuantity,
          total: itemPrice * newQuantity
        };
      } else {
        // Tạo mới với data từ database
        cartItem = {
          id: Date.now() + Math.random(), // Unique ID
          productId: item.id,
          productName: item.name,
          quantity: quantity,
          price: itemPrice,
          total: itemPrice * quantity,
          image: processImageUrl(
            (item as Product).image_url || 
            (item as Product).imageUrl || 
            (item as Product).image ||
            (item as Accessory).image_url
          ),
          stock: availableStock,
          itemType: itemType // 🔥 STORE ITEM TYPE
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

  // 🔥 NEW: PAYMENT PROCESSING FUNCTION
  const processPayment = async (orderId: string, paymentMethod: string, paymentData?: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { loading: true } });
      
      console.log('💳 [CartContext] Processing payment:', { orderId, paymentMethod });

      if (!orderId) {
        throw new Error('Thiếu thông tin đơn hàng');
      }

      let paymentResult;

      switch (paymentMethod) {
        case 'COD':
          // ✅ COD - Chỉ cần cập nhật trạng thái đơn hàng
          paymentResult = await fetch(`http://localhost:3000/orders/${orderId}/payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentMethod: 'COD',
              status: 'pending',
              amount: state.total
            })
          });
          break;

        case 'BANK_TRANSFER':
          case 'BANKING':
  // ✅ GỬI ĐÚNG DATA THEO DTO
  const bankTransferPayload = {
    bankName: paymentData?.bankName || 'TechStore Bank',
    accountNumber: paymentData?.accountNumber || '1234567890',
    transferAmount: state.total,
    transferProofUrl: paymentData?.transferProofUrl || null
  };

  console.log('💰 Bank Transfer Payload:', bankTransferPayload);

  paymentResult = await fetch(`http://localhost:3000/payment/bank-transfer/${orderId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bankTransferPayload)
  });

  if (!paymentResult.ok) {
    const errorText = await paymentResult.text();
    console.error('❌ Bank Transfer API Error:', errorText);
    throw new Error(`Lỗi thanh toán chuyển khoản: ${paymentResult.status}`);
  }

  const bankTransferResult = await paymentResult.json();
  console.log('✅ Bank transfer successful:', bankTransferResult);
  
  return bankTransferResult;

        case 'MOMO':
          // ✅ MOMO PAYMENT - Tích hợp ví MoMo
          const momoPayload = {
            orderId: orderId,
            amount: state.total,
            orderInfo: `Thanh toán đơn hàng ${orderId}`,
            returnUrl: `${window.location.origin}/payment/success`,
            notifyUrl: 'http://localhost:3000/payment/momo/callback'
          };

          paymentResult = await fetch('http://localhost:3000/payment/momo/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(momoPayload)
          });

          if (paymentResult.ok) {
            const momoData = await paymentResult.json();
            if (momoData.payUrl) {
              // Chuyển hướng đến trang thanh toán MoMo
              window.location.href = momoData.payUrl;
              return momoData;
            }
          }
          break;

        case 'VNPAY':
          // ✅ VNPAY PAYMENT - Tích hợp VNPay
          const vnpayPayload = {
            orderId: orderId,
            amount: state.total * 100, // VNPay yêu cầu amount tính bằng VNĐ
            orderDesc: `Thanh toán đơn hàng ${orderId}`,
            bankCode: paymentData?.bankCode || '',
            language: 'vn'
          };

          paymentResult = await fetch('http://localhost:3000/payment/vnpay/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vnpayPayload)
          });

          if (paymentResult.ok) {
            const vnpayData = await paymentResult.json();
            if (vnpayData.paymentUrl) {
              // Chuyển hướng đến trang thanh toán VNPay
              window.location.href = vnpayData.paymentUrl;
              return vnpayData;
            }
          }
          break;

        case 'CREDIT_CARD':
          // ✅ CREDIT CARD - Xử lý thẻ tín dụng (Stripe/VNPay)
          const cardPayload = {
            orderId: orderId,
            amount: state.total,
            currency: 'VND',
            cardInfo: {
              number: paymentData.cardNumber,
              expMonth: paymentData.expMonth,
              expYear: paymentData.expYear,
              cvc: paymentData.cvc,
              name: paymentData.cardName
            }
          };

          paymentResult = await fetch('http://localhost:3000/payment/card/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cardPayload)
          });
          break;

        default:
          throw new Error('Phương thức thanh toán không được hỗ trợ');
      }

      if (!paymentResult.ok) {
        const errorText = await paymentResult.text();
        throw new Error(`Lỗi thanh toán: ${paymentResult.status} - ${errorText}`);
      }

      const paymentResponse = await paymentResult.json();
      console.log('✅ [CartContext] Payment processed successfully:', paymentResponse);

      return paymentResponse;

    } catch (error: any) {
      console.error('❌ [CartContext] processPayment ERROR:', error);
      throw new Error(error.message || 'Có lỗi xảy ra khi xử lý thanh toán');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    }
  };

  // ✅ UPDATED: CHECKOUT - INTEGRATED WITH PAYMENT
  const checkout = async (customerInfo: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { loading: true } });
      
      console.log('💰 [CartContext] Guest Checkout - Processing items:', state.items.length);

      // VALIDATION
      if (state.items.length === 0) {
        throw new Error('Giỏ hàng trống');
      }

      if (!customerInfo?.name || !customerInfo?.email || !customerInfo?.phone || !customerInfo?.shippingAddress) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc (tên, email, số điện thoại, địa chỉ giao hàng)');
      }

      // ✅ 1. TÍNH TOTAL TRƯỚC
      const calculatedTotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      console.log('💰 Calculated total:', calculatedTotal);

      if (calculatedTotal === 0) {
        throw new Error('Lỗi tính toán tổng tiền. Vui lòng thử lại.');
      }

      let customerId: string;

      // ✅ 2. KIỂM TRA CUSTOMER ĐÃ TỒN TẠI THEO EMAIL - FIXED FOR NULL DATA
      console.log(`🔍 Kiểm tra customer tồn tại với email: ${customerInfo.email}`);
      
      try {
        const existCustomerResponse = await fetch(`http://localhost:3000/customers/bymail/${customerInfo.email}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        console.log('🔍 Customer API Response status:', existCustomerResponse.status);

        if (existCustomerResponse.ok) {
          const responseData = await existCustomerResponse.json();
          console.log('🔍 Customer API Response data:', responseData);
          
          // ✅ FIX: KIỂM TRA data CÓ NULL KHÔNG
          if (responseData.data !== null && responseData.data?.id) {
            // ✅ CUSTOMER ĐÃ TỒN TẠI
            customerId = responseData.data.id;
            console.log('✅ Sử dụng customer đã tồn tại:', responseData.data.name, 'ID:', customerId);
            
            // ✅ CẬP NHẬT THÔNG TIN CUSTOMER NẾU CẦN
            console.log('🔄 Cập nhật thông tin customer...');
            const updateResponse = await fetch(`http://localhost:3000/customers/${customerId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: customerInfo.name,
                phone: customerInfo.phone,
                address: customerInfo.shippingAddress
              })
            });
            
            if (!updateResponse.ok) {
              console.warn('⚠️ Không thể cập nhật customer, nhưng vẫn tiếp tục...');
            }
            
          } else {
            // ✅ CUSTOMER CHƯA TỒN TẠI (data: null) - TẠO CUSTOMER MỚI
            console.log('🔄 Customer chưa tồn tại (data: null), tạo customer mới...');
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

            console.log('🔍 Create Customer Response status:', newCustomerResponse.status);

            if (!newCustomerResponse.ok) {
              const errorText = await newCustomerResponse.text();
              throw new Error(`Failed to create customer: ${newCustomerResponse.status} - ${errorText}`);
            }

            const newCustomerData = await newCustomerResponse.json();
            console.log('🔍 Create Customer Response data:', newCustomerData);
            
            // ✅ LẤY customerId TỪ RESPONSE
            if (newCustomerData.data && newCustomerData.data.id) {
              customerId = newCustomerData.data.id;
              console.log('✅ Created new guest customer:', newCustomerData.data.name, 'ID:', customerId);
            } else {
              throw new Error('Customer creation response không có ID');
            }
          }
          
        } else {
          // ❌ LỖI KHI KIỂM TRA CUSTOMER
          const errorText = await existCustomerResponse.text();
          throw new Error(`Không thể kiểm tra thông tin khách hàng: ${existCustomerResponse.status} - ${errorText}`);
        }
      } catch (customerError) {
        console.error('❌ Customer processing error:', customerError);
        throw new Error('Không thể xử lý thông tin khách hàng: ' + customerError.message);
      }

      // ✅ 3. TẠO ORDER VỚI CUSTOMER ID
      const orderData = {
        customerId: customerId,
        items: state.items.map(item => ({
          itemId: item.productId,
          type: item.itemType,
          quantity: item.quantity,
          unitPrice: item.price
        })),
        shippingAddress: customerInfo.shippingAddress,
        billingAddress: customerInfo.billingAddress || customerInfo.shippingAddress,
        paymentMethod: customerInfo.paymentMethod || 'COD',
        totalAmount: calculatedTotal
      };

      console.log('🔄 Creating order with data:', orderData);
      
      // ✅ GỬI REQUEST TẠO ORDER
      const orderResponse = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      console.log('🔍 Order API Response status:', orderResponse.status);

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('❌ Order Error Response:', errorText);
        throw new Error(`Failed to create order: ${orderResponse.status} - ${errorText}`);
      }

      const createdOrder = await orderResponse.json();
      console.log('✅ Order created:', createdOrder);

      // ✅ 4. XỬ LÝ THANH TOÁN NẾU KHÔNG PHẢI COD
      let requiresPaymentRedirect = false;
let paymentResult = null;

if (customerInfo.paymentMethod && customerInfo.paymentMethod !== 'COD') {
  console.log('💳 Payment required for order:', createdOrder.id);
  requiresPaymentRedirect = true;
// ✅ VỚI BANKING, KHÔNG gọi processPayment ở đây
  // Chỉ đánh dấu cần chuyển hướng đến trang thanh toán
  // ❌ XÓA dòng này: paymentResult = await processPayment(createdOrder.id, customerInfo.paymentMethod, customerInfo.paymentData);
}
      // ✅ 5. XÓA GIỎ HÀNG SAU KHI THÀNH CÔNG (chỉ với COD hoặc thanh toán thành công)
     if (customerInfo.paymentMethod === 'COD') {
  await clearCart();
}

return {
  success: true,
  message: requiresPaymentRedirect 
    ? 'Đang chuyển hướng đến trang thanh toán...' 
    : 'Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.',
  orderId: createdOrder.id,
  orderNumber: createdOrder.orderNumber,
  order: createdOrder,
  total: calculatedTotal,
  customerId: customerId,
  requiresPayment: requiresPaymentRedirect, // ✅ QUAN TRỢNG
  paymentMethod: customerInfo.paymentMethod
};

    } catch (error: any) {
      console.error('❌ [CartContext] checkout ERROR:', error);
      const errorMessage = error.message || 'Có lỗi xảy ra khi đặt hàng';
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
      checkout,
      processPayment // 🔥 NEW: ADD PAYMENT FUNCTION
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