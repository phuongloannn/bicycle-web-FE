export class ApiClient {
  private baseUrl: string;
  private getToken: () => string | null;

  constructor(baseUrl: string, getToken: () => string | null) {
    this.baseUrl = baseUrl;
    this.getToken = getToken;
    console.log('🔧 [ApiClient] constructor: baseUrl:', baseUrl, ' - getToken:', getToken);
  }

  private async request(path: string, options: RequestInit = {}) {
    const token = this.getToken();
    const url = `${this.baseUrl}${path}`;
    
    console.log('🔧 [ApiClient] Making request to:', url);
    console.log('🔧 [ApiClient] Token exists:', !!token);
    console.log('🔧 [ApiClient] Method:', options.method);
    
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      credentials: 'include', // ✅ THÊM DÒNG NÀY - QUAN TRỌNG!
    });

    console.log('🔧 [ApiClient] Response status:', res.status);
    console.log('🔧 [ApiClient] Response headers:', Object.fromEntries(res.headers.entries()));
    
    if (!res.ok) {
      const msg = await res.text();
      console.error('❌ [ApiClient] HTTP error:', res.status, msg);
      throw new Error(`API ${res.status}: ${msg}`);
    }
    
    try {
      const data = await res.json();
      console.log('✅ [ApiClient] Response data:', data);
      return data;
    } catch {
      console.log('🔧 [ApiClient] Response has no JSON body');
      return null;
    }
  }

  get(path: string) { 
    console.log('🔧 [ApiClient] GET:', path);
    return this.request(path, { method: 'GET' }); 
  }
  
  post(path: string, body?: any) { 
    console.log('🔧 [ApiClient] POST:', path);
    console.log('🔧 [ApiClient] POST body:', body);
    return this.request(path, { method: 'POST', body: JSON.stringify(body) }); 
  }
  
  put(path: string, body?: any) { 
    console.log('🔧 [ApiClient] PUT:', path);
    return this.request(path, { method: 'PUT', body: JSON.stringify(body) }); 
  }
  
  delete(path: string) { 
    console.log('🔧 [ApiClient] DELETE:', path);
    return this.request(path, { method: 'DELETE' }); 
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  () => {
    if (typeof window === 'undefined') {
      console.log('🔧 [ApiClient] getToken() - Server side, returning null');
      return null;
    }
    
    const token = localStorage.getItem('token');
    console.log('🔧 [ApiClient] getToken() called - Token exists:', !!token);
    console.log('🔧 [ApiClient] Token value:', token ? `${token.substring(0, 20)}...` : 'null');
    
    return token;
  }
);