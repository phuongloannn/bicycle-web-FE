// creditCardService.ts
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
      const response = await axios.post('/payments/credit-card', paymentData);
      return response.data;
    } catch {
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
      cardNumberRegex.test(cardDetails.cardNumber) &&
      cvvRegex.test(cardDetails.cvv) &&
      expiryRegex.test(cardDetails.expiryDate)
    );
  }
};