import { NextRequest, NextResponse } from 'next/server';
import { guestCarts } from "../data";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.headers.get('X-Session-ID');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const cart = guestCarts[sessionId] || { items: [], total: 0, itemCount: 0 };
    
    return NextResponse.json({ 
      success: true,
      data: cart 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.headers.get('X-Session-ID');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    delete guestCarts[sessionId];
    
    return NextResponse.json({ 
      success: true,
      message: 'Cart cleared successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}