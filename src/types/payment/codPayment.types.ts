// codPayment.types.ts
export interface CODPaymentRequest {
  actualReceivedAmount?: number;
}

export interface CODPaymentResponse {
  id: number;
  orderId: number;
  status: 'pending' | 'delivered' | 'paid';
}