class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    console.log(`🚀 [API] ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `API Error ${response.status}`;
        
        // Try to parse JSON error response
        try {
          const errorJson = JSON.parse(errorText);
          // Extract message from NestJS error format
          if (errorJson.message) {
            errorMessage = Array.isArray(errorJson.message) 
              ? errorJson.message.join(', ') 
              : errorJson.message;
          } else if (errorJson.error) {
            errorMessage = errorJson.error;
          }
        } catch {
          // If not JSON, use the text as is
          errorMessage = errorText || errorMessage;
        }
        
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).response = errorText;
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error(`💥 [API] ${options.method || 'GET'} ${url} failed:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, { method: 'POST', body: data ? JSON.stringify(data) : undefined });
  }

  async put<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, { method: 'PUT', body: data ? JSON.stringify(data) : undefined });
  }

  async patch<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined });
  }

  async delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
