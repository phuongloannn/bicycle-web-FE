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
}

export default function StoreHomepage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.slice(0, 8)); // Hiển thị 8 sản phẩm đầu tiên
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Our Bicycle Store
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover the perfect bicycle for your adventure
        </p>
        <Link 
          href="/store/products"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
        >
          Shop Now
        </Link>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Bicycles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="mt-4 flex space-x-2">
                  <Link 
                    href={`/store/products/${product.id}`}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded text-center hover:bg-gray-300"
                  >
                    View Details
                  </Link>
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}