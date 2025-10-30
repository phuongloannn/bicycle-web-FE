'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  quantity: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/products/search?q=${searchTerm}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const addToCart = async (productId: number, price: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to add to cart');
        return;
      }

      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          price
        })
      });

      if (response.ok) {
        alert('Product added to cart!');
      } else {
        alert('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bicycles..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2"
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </form>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={product.image || '/images/placeholder-bike.jpg'} 
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.category}</p>
              <p className="text-blue-600 font-bold text-lg">${product.price}</p>
              <p className="text-gray-500 text-sm">Stock: {product.quantity}</p>
              
              <div className="mt-4 flex space-x-2">
                <Link 
                  href={`/store/products/${product.id}`}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded text-center hover:bg-gray-300"
                >
                  Details
                </Link>
                <button 
                  onClick={() => addToCart(product.id, product.price)}
                  disabled={product.quantity === 0}
                  className={`flex-1 py-2 px-4 rounded ${
                    product.quantity === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}