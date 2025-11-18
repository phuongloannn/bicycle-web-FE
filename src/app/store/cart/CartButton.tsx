"use client";

import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CartButton() {
  const { state } = useCart();

  const totalQty = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href="/store/cart"
      className="relative flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      <ShoppingCart size={20} />

      {totalQty > 0 && (
        <span
          className="
            absolute -top-1 -right-1 
            flex items-center justify-center 
            bg-red-500 text-white text-xs 
            rounded-full h-5 min-w-5 px-1
          "
        >
          {totalQty}
        </span>
      )}
    </Link>
  );
}
