import { apiClient } from '@/lib/api/client';
import { LoginResponse } from "@/types/auth";


export const AuthService = {
  async signin(email: string, password: string) {
    try {
      console.log('🎯 [AuthService] STARTING LOGIN PROCESS');
      console.log('🔧 [AuthService] Email:', email);
      console.log('🔧 [AuthService] Password provided:', !!password);
      
      // ✅ DEBUG BIẾN MÔI TRƯỜNG
      console.log('🔧 [AuthService] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('🔧 [AuthService] Default fallback URL: http://localhost:3000');
      
      // ✅ THỬ CÁC ENDPOINT KHÁC NHAU
      const endpoints = [
        '/auth/login',      // Phổ biến nhất
        '/auth/signin',     // Phổ biến thứ 2
        '/api/auth/login',
        '/api/auth/signin',
        '/login', 
        '/signin'
      ];
      
      let successfulEndpoint = '';
      let responseData = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`\n🔧 [AuthService] === TRYING ENDPOINT: ${endpoint} ===`);
          
          const res = await apiClient.post<LoginResponse>(endpoint, {
  email,
  password
});

          
          console.log(`✅ [AuthService] SUCCESS with endpoint: ${endpoint}`);
          successfulEndpoint = endpoint;
          responseData = res;
          break; // Thoát vòng lặp khi thành công
          
        } catch (err: any) {
          console.log(`❌ [AuthService] Failed with ${endpoint}:`, err.message);
          
          // Nếu lỗi 404, tiếp tục thử endpoint khác
          if (err.message.includes('404')) {
            continue;
          }
          
          // Nếu lỗi khác (401, 500, etc), throw error
          throw err;
        }
      }
      
      if (!successfulEndpoint) {
        throw new Error('No working authentication endpoint found. Check backend routes.');
      }
      
      console.log('✅ [AuthService] Login successful with endpoint:', successfulEndpoint);
      console.log('🔧 [AuthService] Response data:', responseData);
      
      // ✅ XỬ LÝ TOKEN
      const token = responseData?.accessToken || responseData?.access_token;
      const user = responseData?.user;
      
      if (!token) {
        throw new Error('No access token received from server');
      }
      
      console.log('🔧 [AuthService] Token received:', token ? `${token.substring(0, 20)}...` : 'null');
      console.log('🔧 [AuthService] User received:', user);
      
      // ✅ LƯU VÀO LOCALSTORAGE
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // ✅ VERIFY STORAGE
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      console.log('✅ [AuthService] Token saved successfully:', !!savedToken);
      console.log('✅ [AuthService] User saved successfully:', !!savedUser);
      console.log('✅ [AuthService] Saved user role:', user?.role);
      
      return responseData;
      
    } catch (err: any) {
      console.error('❌ [AuthService] LOGIN FAILED:', err);
      throw new Error(err.message || 'Login failed. Please check your credentials.');
    }
  },

  // ... rest of your methods
};