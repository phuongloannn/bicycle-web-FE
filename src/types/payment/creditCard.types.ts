// creditCard.types.ts
export interface CreditCardPaymentRequest {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  amount: number;
}

export interface CreditCardPaymentResponse {
  id: number;
  orderId: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
}