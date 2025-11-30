// src/services/payment/creditCardService.ts
import axios from 'axios';

export const creditCardService = {
  async processPayment(paymentData: {
    orderId: number,
    cardNumber: string,
    cardHolderName: string,
    expiryDate: string,
    cvv: string,
    amount: number
  }) {
    try {
      // 🔧 MOCK TEST LOGIC
      const lastDigit = paymentData.cardNumber.replace(/\s/g, '').slice(-1); // lấy số cuối cùng
      const isEven = Number(lastDigit) % 2 === 0;

      // CVV phải là 123
      if (paymentData.cvv !== '123') {
        return { status: 'failed', message: 'CVV phải là 123 để thanh toán thành công' };
      }

      // Số thẻ chẵn → success, lẻ → fail
      if (isEven) {
        return {
          status: 'success',
          message: 'Thanh toán thành công (mock)',
          orderId: paymentData.orderId,
          amount: paymentData.amount
        };
      } else {
        return {
          status: 'failed',
          message: 'Số thẻ kết thúc bằng số lẻ → thất bại (mock)',
          orderId: paymentData.orderId
        };
      }

      // ❌ Nếu muốn gọi API thật thì bỏ đoạn mock trên và dùng axios:
      // const response = await axios.post('/payments/credit-card', paymentData);
      // return response.data;

    } catch (error) {
      throw new Error('Thanh toán thẻ tín dụng thất bại');
    }
  },

  validateCreditCard(cardDetails: {
    cardNumber: string,
    expiryDate: string,
    cvv: string
  }): boolean {
    // Basic validation
    const cardNumberRegex = /^\d{16}$/;
    const cvvRegex = /^\d{3,4}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

    return (
      cardNumberRegex.test(cardDetails.cardNumber.replace(/\s/g, '')) &&
      cvvRegex.test(cardDetails.cvv) &&
      expiryRegex.test(cardDetails.expiryDate)
    );
  }
};
