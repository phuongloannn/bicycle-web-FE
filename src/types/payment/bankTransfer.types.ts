// bankTransfer.types.ts
export interface BankTransferPaymentRequest {
  bankName: string;
  accountNumber: string;
  transferAmount: number;
  transferProofUrl?: string;
}

export interface BankTransferPaymentResponse {
  id: number;
  orderId: number;
  status: 'pending' | 'paid' | 'failed';
}