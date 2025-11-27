import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/contexts/SidebarContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body 
        className={`${outfit.className} `}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <SidebarProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
