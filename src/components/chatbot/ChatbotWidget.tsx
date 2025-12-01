'use client';

import { useState, useRef, useEffect } from 'react';
import './chat.css';

export default function CustomerChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Dữ liệu sản phẩm mẫu (có thể mở rộng lấy từ DB)
  const products = [
    {
      name: 'Xe đạp địa hình thể thao Maruishi ASO',
      price: 6550000,
      color_options: ['Đen', 'Xanh', 'Đỏ'],
      model_year: '2025',
      category: 'Xe đạp địa hình',
      type: 'Mountain Bike',
      accessories: ['mũ bảo hiểm', 'găng tay', 'bình nước', 'đèn xe'],
    },
    {
      name: 'Xe đạp trẻ em NISHIKI ANNA 20',
      price: 3999000,
      color_options: ['Hồng', 'Xanh', 'Trắng'],
      model_year: '2025',
      category: 'Xe đạp trẻ em',
      type: 'Kids Bike',
      accessories: ['mũ bảo hiểm', 'găng tay'],
    },
    {
      name: 'Xe đạp touring Maruishi Half Miler',
      price: 3333000,
      color_options: ['Xám', 'Đen'],
      model_year: '2025',
      category: 'Xe đạp touring',
      type: 'Touring Bike',
      accessories: ['mũ bảo hiểm', 'bình nước'],
    },
    {
      name: 'Xe đạp đua RIKULAU CADENCE',
      price: 2999000,
      color_options: ['Đỏ', 'Đen', 'Trắng'],
      model_year: '2025',
      category: 'Xe đạp đua',
      type: 'Road Bike',
      accessories: ['mũ bảo hiểm', 'găng tay', 'đèn xe'],
    },
  ];

  // Danh sách FAQ
  const faqResponses: { question: RegExp; answer: string }[] = [
    { question: /giờ mở cửa/i, answer: 'Cửa hàng mở từ 8h sáng đến 8h tối tất cả các ngày trong tuần.' },
    { question: /đặt hàng/i, answer: 'Bạn có thể đặt hàng trực tiếp trên website hoặc gọi hotline của chúng tôi.' },
    { question: /giao hàng/i, answer: 'Chúng tôi giao hàng toàn quốc, phí vận chuyển tùy theo địa chỉ.' },
    { question: /khuyến mãi/i, answer: 'Các chương trình khuyến mãi được cập nhật trên trang chủ và fanpage của chúng tôi.' },
    { question: /đổi trả|chính sách/i, answer: 'Bạn có thể đổi trả sản phẩm trong vòng 7 ngày nếu còn nguyên tem và hóa đơn.' },
    { question: /sản phẩm/i, answer: 'Chúng tôi có nhiều sản phẩm thể thao cao cấp, bạn có muốn xem danh mục không?' },
  ];

  // Hàm tạo phản hồi từ sản phẩm
  const getProductReply = (msg: string) => {
    const lowerMsg = msg.toLowerCase();
    const matched = products.filter(p =>
      lowerMsg.includes(p.category.toLowerCase()) ||
      lowerMsg.includes(p.type.toLowerCase())
    );

    if (matched.length === 0) return null;

    // Chọn sản phẩm đầu tiên
    const p = matched[0];
    return `Mình gợi ý sản phẩm **${p.name}** (${p.model_year}), có các màu: ${p.color_options.join(', ')}. Giá khoảng ${p.price.toLocaleString()} VND. Bạn có thể kết hợp thêm ${p.accessories.join(', ')} để trải nghiệm tốt hơn.`;
  };

  // Gửi tin nhắn
  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { from: 'user', text: userMessage }]);
    setInput('');

    // 1. Kiểm tra sản phẩm
    const productReply = getProductReply(userMessage);
    if (productReply) {
      setMessages(prev => [...prev, { from: 'bot', text: productReply }]);
      return;
    }

    // 2. Kiểm tra FAQ
    const faqMatch = faqResponses.find(faq => faq.question.test(userMessage));
    const botReply = faqMatch?.answer || 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn.';
    setMessages(prev => [...prev, { from: 'bot', text: botReply }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-widget-container">
      {/* Nút mở/đóng */}
      <button
        onClick={() => setOpen(!open)}
        className="chat-button"
      >
        {open ? '×' : '💬'}
      </button>

      {/* Chat window */}
      {open && (
        <div className="chat-box mt-2">
          {/* Header */}
          <div className="bg-gray-900 text-white px-4 py-2 font-bold text-center">
            Hỗ trợ khách hàng
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
              >
                <div className={`px-3 py-2 rounded-lg max-w-[70%] ${
                  msg.from === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nhập câu hỏi..."
            />
            <button onClick={handleSend}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
}
