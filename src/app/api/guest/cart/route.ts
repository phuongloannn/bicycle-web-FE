// src/app/api/guest/cart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { guestCarts, GuestCart } from "../../cart/data";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const sessionId = request.headers.get('X-Session-ID');
    
    if (!sessionId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Session ID required' 
        },
        { status: 400 }
      );
    }

    // Đảm bảo cart có cấu trúc đúng
    const cart: GuestCart = guestCarts[sessionId] || { 
      items: [], 
      total: 0, 
      itemCount: 0 
    };
    
    console.log('✅ [API] Get cart:', { 
      sessionId: sessionId.substring(0, 10) + '...', 
      itemCount: cart.items.length,
      total: cart.total
    });
    
    return NextResponse.json({ 
      success: true,
      data: cart 
    });

  } catch (error) {
    console.error('❌ [API] Get cart error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const sessionId = request.headers.get('X-Session-ID');
    
    if (!sessionId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Session ID required' 
        },
        { status: 400 }
      );
    }

    const hadCart = !!guestCarts[sessionId];
    delete guestCarts[sessionId];
    
    console.log('✅ [API] Cart cleared:', { 
      sessionId: sessionId.substring(0, 10) + '...',
      hadCart 
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Cart cleared successfully',
      hadCart
    });

  } catch (error) {
    console.error('❌ [API] Clear cart error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to clear cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Thêm PATCH để update cart
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const sessionId = request.headers.get('X-Session-ID');
    const updates = await request.json();
    
    if (!sessionId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Session ID required' 
        },
        { status: 400 }
      );
    }

    console.log('🔄 [API] Update cart:', { 
      sessionId: sessionId.substring(0, 10) + '...',
      updates 
    });

    return NextResponse.json({
      success: true,
      message: 'Cart update endpoint - implement logic here',
      data: guestCarts[sessionId] || { items: [], total: 0, itemCount: 0 }
    });

  } catch (error) {
    console.error('❌ [API] Update cart error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}