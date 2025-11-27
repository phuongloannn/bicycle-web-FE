// src/hooks/payment/useCreditCardPayment.ts
import { useState } from 'react';
import { creditCardService } from '../../services/payment/creditCardService';

interface CreditCardDetails {
  orderId: number;
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  amount: number;
}

export const useCreditCardPayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const processCreditCardPayment = async (paymentData: CreditCardDetails) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate card details
      if (!creditCardService.validateCreditCard({
        cardNumber: paymentData.cardNumber,
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv
      })) {
        throw new Error('Thông tin thẻ không hợp lệ');
      }

      // Process payment
      const result = await creditCardService.processPayment(paymentData);
      setPaymentResult(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    processCreditCardPayment, 
    loading, 
    error, 
    paymentResult 
  };
};