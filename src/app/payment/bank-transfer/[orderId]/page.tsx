'use client';

import { useParams, useSearchParams } from 'next/navigation';
import BankTransferForm from '@/components/payment/BankTransferForm';

export default function BankTransferPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  // Lấy orderId từ URL: /payment/bank-transfer/123
  const orderId = Number(params.orderId);

  // Lấy amount từ query string: ?amount=500000
  const totalAmount = Number(searchParams.get('amount')) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <BankTransferForm orderId={orderId} totalAmount={totalAmount} />
    </div>
  );
}
