// src/app/api/cart/checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1️⃣ Lấy body và sessionId từ FE
    const body = await request.json();
    const sessionId = request.headers.get('x-session-id') || request.headers.get('X-Session-ID');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }

    console.log('🔄 [Proxy] Forwarding guest checkout to backend...', { sessionId, body });

    // 2️⃣ Forward tới backend GuestCartController
    const backendResponse = await fetch('http://localhost:3000/guest/cart/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId, // ✅ chữ thường match BE
      },
      body: JSON.stringify(body), // body chứa customer info
    });

    const result = await backendResponse.json();

    console.log('✅ [Proxy] Backend response status:', backendResponse.status, 'body:', result);

    return NextResponse.json(result, { status: backendResponse.status });

  } catch (error) {
    console.error('❌ [Proxy] Guest checkout proxy error:', error);
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
  }
}
