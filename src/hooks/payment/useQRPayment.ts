import { useState } from 'react';

interface QRPaymentState {
  qrCode: string | null;
  loading: boolean;
  error: string | null;
}

export default function useQRPayment(orderId: number, totalAmount: number) {
  const [state, setState] = useState<QRPaymentState>({
    qrCode: null,
    loading: false,
    error: null,
  });

  const generateQR = async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      console.log('🔍 [useQRPayment] Generating QR for order:', orderId, 'amount:', totalAmount);
      
      const response = await fetch(`http://localhost:3000/payment/bank-transfer/qr/${orderId}?amount=${totalAmount}`);
      
      if (!response.ok) {
        throw new Error(`Failed to generate QR: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.qrCode) {
        console.log('✅ [useQRPayment] QR generated successfully');
        setState({
          qrCode: data.qrCode,
          loading: false,
          error: null,
        });
      } else {
        throw new Error(data.message || 'Không thể tạo mã QR');
      }
    } catch (error: any) {
      console.error('❌ [useQRPayment] ERROR:', error);
      setState({
        qrCode: null,
        loading: false,
        error: error.message || 'Có lỗi xảy ra khi tạo mã QR',
      });
    }
  };

  const reset = () => {
    setState({
      qrCode: null,
      loading: false,
      error: null,
    });
  };

  return {
    qrCode: state.qrCode,
    loading: state.loading,
    error: state.error,
    generateQR,
    reset,
  };
}