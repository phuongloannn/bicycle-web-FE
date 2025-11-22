import { useState } from 'react';
import { bankTransferService } from "@/services/payment/bankTransferService";

export function useQRPayment(orderId: number, amount: number) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQR = async () => {
    try {
      setLoading(true);
      setError(null);
      const qr = await bankTransferService.generateQRCode(orderId, amount);
      setQrCode(qr);
    } catch (err) {
      setError('Không thể tạo QR code');
    } finally {
      setLoading(false);
    }
  };

  return { qrCode, loading, error, generateQR };
}
