export default function StoreHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">Store</h1>
          <nav className="flex space-x-4">
            <a href="/store" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="/store/products" className="text-gray-600 hover:text-gray-900">Products</a>
            <a href="/store/cart" className="text-gray-600 hover:text-gray-900">Cart</a>
          </nav>
        </div>
      </div>
    </header>
  );
}