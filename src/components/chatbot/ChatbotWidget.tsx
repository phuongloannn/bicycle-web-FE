// src/components/chatbot/ChatbotWidget.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([
    { from: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn về sản phẩm Q-SPORTS?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { from: 'user', text: userMessage }]);
    setInput('');

    setTimeout(() => {
      const botReply = 'Cảm ơn câu hỏi của bạn! Đội ngũ hỗ trợ sẽ liên hệ với bạn sớm nhất.';
      setMessages(prev => [...prev, { from: 'bot', text: botReply }]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Nút mở/đóng */}
      <button
        onClick={() => setOpen(!open)}
        className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-bounce"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {open && (
        <div className="mt-2 bg-white rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-gray-900 text-white px-4 py-3 rounded-t-2xl">
            <div className="font-bold text-center">Hỗ trợ khách hàng Q-SPORTS</div>
            <div className="text-xs text-gray-300 text-center">Trực tuyến • Sẵn sàng hỗ trợ</div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
              >
                <div className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                  msg.from === 'user' 
                    ? 'bg-gray-900 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Nhập câu hỏi..."
                className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <button 
                onClick={handleSend}
                className="bg-gray-900 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                ↑
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Nhấn Enter để gửi • Hỗ trợ 24/7
            </p>
          </div>
        </div>
      )}
    </div>
  );
}