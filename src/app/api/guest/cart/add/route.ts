// src/app/api/guest/cart/add/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { guestCarts, CartItem, GuestCart } from "../../../cart/data";  // ✅ ĐÚNG RỒI

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.headers.get('X-Session-ID');
    const { productId, quantity = 1 } = await request.json();

    console.log('🎯 [API] Add to cart:', { sessionId, productId, quantity });

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Session ID required' },
        { status: 400 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID required' },
        { status: 400 }
      );
    }

    const cart: GuestCart = guestCarts[sessionId] || { 
      items: [], 
      total: 0, 
      itemCount: 0 
    };
    
    const existingItemIndex = cart.items.findIndex((item: CartItem) => item.productId === productId);
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].total = cart.items[existingItemIndex].quantity * cart.items[existingItemIndex].price;
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        productId,
        productName: 'Product ' + productId,
        quantity,
        price: 100000,
        total: 100000 * quantity,
        image: '/images/placeholder-product.jpg'
      };
      cart.items.push(newItem);
    }

    cart.total = cart.items.reduce((sum: number, item: CartItem) => sum + item.total, 0);
    cart.itemCount = cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

    guestCarts[sessionId] = cart;

    console.log('✅ [API] Cart updated:', cart);

    return NextResponse.json({
      success: true,
      message: 'Product added to cart successfully',
      data: cart
    });

  } catch (error) {
    console.error('❌ [API] Add to cart error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}