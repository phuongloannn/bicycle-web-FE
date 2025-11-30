'use client';

import StoreHeader from "@/components/store/StoreHeader";
import CustomerChatWidget from "@/components/chatbot/ChatbotWidget";

// Import CSS của chatbot
import "@/components/chatbot/chat.css"; // chắc chắn file chat.css nằm ở src/components/chatbot/chat.css

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Header của cửa hàng */}
      <StoreHeader />

      {/* Nội dung chính của page */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {children}
      </main>

      {/* Chatbot luôn hiển thị trên mọi page trong layout */}
      <CustomerChatWidget />
    </div>
  );
}
