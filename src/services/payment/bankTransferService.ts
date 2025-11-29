import axios from 'axios';

export const bankTransferService = {
  // ✅ Gọi API tạo QR code
  async generateQRCode(orderId: number, amount: number) {
    // Gọi đúng URL backend (không thừa /api, đúng port backend)
    const res = await axios.get(`http://localhost:3000/payment/bank-transfer/qr/${orderId}?amount=${amount}`);
    // Backend trả về { qrCode: "data:image/png;base64,..." }
    return res.data.qrCode;
  },

  // ✅ Gọi API tạo thanh toán chuyển khoản
  async createBankTransferPayment(orderId: number, paymentData: any) {
    const res = await axios.post(`http://localhost:3000/payment/bank-transfer/${orderId}`, paymentData);
    return res.data.payment;
  },

  // ✅ Gọi API xác nhận đã chuyển khoản
  async verifyBankTransfer(paymentId: number) {
    const res = await axios.post(`http://localhost:3000/payment/bank-transfer/verify/${paymentId}`);
    return res.data;
  }
};