'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  image: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (response.ok) {
        fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.total, 0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!localStorage.getItem('token')) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p>You need to be logged in to view your cart.</p>
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">Your cart is empty</p>
          <Link 
            href="/store/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center">
                <img 
                  src={item.image || '/images/placeholder-bike.jpg'} 
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded"
                />
                
                <div className="flex-1 ml-4">
                  <h3 className="font-semibold text-lg">{item.productName}</h3>
                  <p className="text-gray-600">${item.price}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-gray-200 w-8 h-8 rounded-full"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-gray-200 w-8 h-8 rounded-full"
                  >
                    +
                  </button>
                </div>

                <div className="ml-4 text-right">
                  <p className="font-semibold">${item.total.toFixed(2)}</p>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$10.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(getTotalPrice() + 10).toFixed(2)}</span>
              </div>
            </div>

            <Link 
              href="/store/checkout"
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-center block hover:bg-blue-700"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}