import { NextRequest, NextResponse } from 'next/server';

// ✅ Get backend URL, remove trailing slash and /api if present
const getBackendURL = () => {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  // Remove trailing slash
  let url = apiBase.replace(/\/$/, '');
  // Remove /api suffix if present (some configs might have it)
  url = url.replace(/\/api$/, '');
  return url;
};

const BACKEND_URL = getBackendURL();

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 [API Proxy] POST /api/auth/login - Forwarding to BE...');
    
    const body = await request.json();
    
    console.log('🔧 [API Proxy] Calling BE:', `${BACKEND_URL}/auth/login`);
    
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('🔧 [API Proxy] BE Response status:', response.status);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ [API Proxy] Login failed:', data);
      return NextResponse.json(
        { error: data.message || 'Login failed' },
        { status: response.status }
      );
    }

    console.log('✅ [API Proxy] Login success');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ [API Proxy] Network error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend' },
      { status: 500 }
    );
  }
}