// src/components/chatbot/ChatbotWidget.tsx
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Danh sách câu hỏi mẫu & trả lời
  const faqResponses: { question: RegExp; answer: string }[] = [
    { question: /giờ mở cửa/i, answer: 'Cửa hàng mở từ 8h sáng đến 8h tối tất cả các ngày trong tuần.' },
    { question: /đặt hàng/i, answer: 'Bạn có thể đặt hàng trực tiếp trên website hoặc gọi hotline của chúng tôi.' },
    { question: /giao hàng/i, answer: 'Chúng tôi giao hàng toàn quốc, phí vận chuyển tùy theo địa chỉ.' },
    { question: /khuyến mãi/i, answer: 'Các chương trình khuyến mãi được cập nhật trên trang chủ và fanpage của chúng tôi.' },
    { question: /đổi trả/i, answer: 'Bạn có thể đổi trả sản phẩm trong vòng 7 ngày nếu còn nguyên tem và hóa đơn.' },
    { question: /sản phẩm/i, answer: 'Chúng tôi có nhiều sản phẩm thể thao cao cấp, bạn có muốn xem danh mục không?' },
  ];

  // Hàm gửi tin nhắn
  const handleSend = async () => {
    if (!input.trim()) return;

    // Thêm tin nhắn của user vào history
    setMessages(prev => [...prev, { from: 'user', text: input }]);
    const userMessage = input;
    setInput('');

    // Tìm câu trả lời từ FAQ trước
    const faqMatch = faqResponses.find(faq => faq.question.test(userMessage));
    if (faqMatch) {
      setMessages(prev => [...prev, { from: 'bot', text: faqMatch.answer }]);
      return;
    }

    // Nếu muốn dùng API backend, mở phần này
    /*
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      if (data?.reply) {
        setMessages(prev => [...prev, { from: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { from: 'bot', text: 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn.' }]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { from: 'bot', text: 'Lỗi kết nối chatbot.' }]);
    }
    */

    // Fallback
    setMessages(prev => [...prev, { from: 'bot', text: 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn.' }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Nút mở/đóng */}
      <button
        onClick={() => setOpen(!open)}
        className="w-16 h-16 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-gray-800 transition-colors"
      >
        {open ? '×' : '💬'}
      </button>

      {/* Chat window */}
      {open && (
        <div className="w-80 max-w-xs bg-white dark:bg-gray-800 rounded-xl shadow-xl mt-4 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 text-white px-4 py-2 font-bold text-center">
            Hỗ trợ khách hàng
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto h-64 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[70%] ${
                    msg.from === 'user'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input */}
          <div className="flex border-t border-gray-300 dark:border-gray-600 p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nhập câu hỏi..."
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleSend}
              className="ml-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
