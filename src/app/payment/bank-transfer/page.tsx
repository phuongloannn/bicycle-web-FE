'use client';

import { useSearchParams } from 'next/navigation';
import BankTransferForm from '@/components/payment/BankTransferForm';

export default function BankTransferPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  if (!orderId || !amount) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Thiếu thông tin đơn hàng. Vui lòng quay lại trang checkout.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <BankTransferForm 
        orderId={parseInt(orderId)} 
        totalAmount={parseFloat(amount)} 
      />
    </div>
  );
}