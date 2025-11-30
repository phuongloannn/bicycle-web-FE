// src/app/api/cart/checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionId = request.headers.get('x-session-id') || request.headers.get('X-Session-ID');

    if (!sessionId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing session ID' 
      }, { status: 400 });
    }

    console.log('🔄 [Proxy] Forwarding checkout to GUEST CART CHECKOUT...', { 
      sessionId: sessionId.substring(0, 10) + '...', 
      customer: body.name 
    });

    // ✅ GỌI ĐẾN GUEST CART CHECKOUT CỦA CHÚNG TA
    const apiResponse = await fetch(`http://localhost:3001/api/guest/cart/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
      body: JSON.stringify(body),
    });

    const result = await apiResponse.json();

    console.log('✅ [Proxy] Guest cart checkout response:', {
      status: apiResponse.status,
      success: result.success,
      message: result.message
    });

    return NextResponse.json(result, { status: apiResponse.status });

  } catch (error) {
    console.error('❌ [Proxy] Checkout error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Proxy failed',
      message: 'Không thể kết nối đến server thanh toán' 
    }, { status: 500 });
  }
}