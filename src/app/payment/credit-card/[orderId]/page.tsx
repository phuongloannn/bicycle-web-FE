'use client';

import { useParams, useSearchParams } from 'next/navigation';
import CreditCardForm from '@/components/payment/CreditCardForm';

export default function CreditCardPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  // Lấy orderId từ URL: /payment/credit-card/123
  const orderId = Number(params.orderId);

  // Lấy amount từ query string: ?amount=500000
  const totalAmount = Number(searchParams.get('amount')) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <CreditCardForm orderId={orderId} totalAmount={totalAmount} />
    </div>
  );
}