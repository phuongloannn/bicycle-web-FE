import React, { useState, useEffect } from 'react';
import { CreateOrderRequest } from '@/types/order';
import { orderService } from '@/services/orderService';

interface CreateOrderProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

const CreateOrder: React.FC<CreateOrderProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CreateOrderRequest>({
    customerId: 0,
    items: [{ productId: 0, quantity: 1, unitPrice: 0 }],
    shippingAddress: '',
    billingAddress: '',
    paymentMethod: 'COD'
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // ✅ CHỈ DÙNG DỮ LIỆU THỰC TỪ API - KHÔNG DÙNG DỮ LIỆU MẪU
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setDataLoading(true);
        setError('');
        
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        
        // ✅ LOAD CUSTOMERS TỪ API
        const customersResponse = await fetch(`${baseURL}/customers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!customersResponse.ok) {
          throw new Error(`Failed to load customers: ${customersResponse.status}`);
        }

        const customersApiResponse = await customersResponse.json();
        const customersData = customersApiResponse.data || [];
        console.log('✅ Customers loaded from API:', customersData);

        // ✅ LOAD PRODUCTS TỪ API
        const productsResponse = await fetch(`${baseURL}/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!productsResponse.ok) {
          throw new Error(`Failed to load products: ${productsResponse.status}`);
        }

        // Products controller trả về trực tiếp mảng, không wrap
        const productsData: Product[] = await productsResponse.json();
        console.log('✅ Products loaded from API:', productsData);

        // ✅ CHỈ SET DỮ LIỆU TỪ API, KHÔNG DÙNG FALLBACK
        setCustomers(customersData);
        setProducts(productsData);

      } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
        setError('Không thể tải danh sách khách hàng và sản phẩm từ server. Vui lòng thử lại.');
        
        // ✅ KHÔNG SET DỮ LIỆU MẪU - ĐỂ MẢNG RỖNG
        setCustomers([]);
        setProducts([]);
      } finally {
        setDataLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: 0, quantity: 1, unitPrice: 0 }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = formData.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        
        if (field === 'productId') {
          const productId = parseInt(value);
          const selectedProduct = products.find(p => p.id === productId);
          if (selectedProduct) {
            updatedItem.unitPrice = Number(selectedProduct.price);
          }
        }

        if (field === 'quantity') {
          const quantity = parseInt(value) || 1;
          updatedItem.quantity = quantity < 1 ? 1 : quantity;
        }
        
        return updatedItem;
      }
      return item;
    });

    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.customerId === 0) {
      setError('Vui lòng chọn khách hàng');
      setLoading(false);
      return;
    }

    if (formData.items.some(item => item.productId === 0)) {
      setError('Vui lòng chọn sản phẩm cho tất cả các mục');
      setLoading(false);
      return;
    }

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      
      // ✅ CONVERT TẤT CẢ SANG NUMBER
      const orderData = {
        customerId: Number(formData.customerId),
        items: formData.items.map(item => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice)
        })),
        shippingAddress: formData.shippingAddress || undefined,
        billingAddress: formData.billingAddress || undefined,
        paymentMethod: formData.paymentMethod || undefined
      };

      console.log('📤 Sending order data:', orderData);

      // ✅ CREATE ORDER
      const response = await fetch(`${baseURL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      const responseText = await response.text();
      console.log('📥 Raw API response:', responseText);
      console.log('📊 Response status:', response.status, response.statusText);

      // ✅ FIX: CHỈ CẦN KIỂM TRA HTTP STATUS, KHÔNG CẦN statusCode
      if (response.ok) {
        console.log('✅ Order created successfully!');
        onSuccess();
      } else {
        console.error('❌ Order creation failed:', response.status, responseText);
        
        let errorMessage = `Lỗi tạo đơn hàng: ${response.status}`;
        try {
          const errorResponse = JSON.parse(responseText);
          errorMessage = errorResponse.message || errorResponse.error || errorMessage;
        } catch (parseError) {
          // Nếu không parse được JSON, dùng message mặc định
        }
        
        throw new Error(errorMessage);
      }

    } catch (error) {
      console.error('💥 Error creating order:', error);
      
      // ✅ HIỂN THỊ LỖI THÂN THIỆN
      let userFriendlyError = 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.';
      
      if (error instanceof Error) {
        if (error.message.includes('Customer not found')) {
          userFriendlyError = 'Không tìm thấy khách hàng. Vui lòng kiểm tra lại.';
        } else if (error.message.includes('Product with ID')) {
          userFriendlyError = 'Không tìm thấy sản phẩm. Vui lòng kiểm tra lại.';
        } else if (error.message.includes('Insufficient stock')) {
          userFriendlyError = 'Số lượng sản phẩm trong kho không đủ. Vui lòng kiểm tra lại.';
        } else if (error.message.includes('HTTP error') || error.message.includes('Lỗi tạo đơn hàng')) {
          userFriendlyError = error.message;
        }
      }
      
      setError(userFriendlyError);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  if (dataLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu từ server...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Tạo đơn hàng mới</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khách hàng *
            </label>
            <select
              value={formData.customerId}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                customerId: parseInt(e.target.value) 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={customers.length === 0}
            >
              <option value="0">
                {customers.length === 0 ? 'Đang tải khách hàng...' : 'Chọn khách hàng'}
              </option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} {customer.email && `(${customer.email})`}
                </option>
              ))}
            </select>
            {customers.length === 0 && !dataLoading && (
              <p className="text-sm text-red-500 mt-1">
                Không có khách hàng nào trong hệ thống. Vui lòng tạo khách hàng trước.
              </p>
            )}
          </div>

          {/* Order Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Sản phẩm *
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={products.length === 0}
              >
                + Thêm sản phẩm
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-4 mb-4 p-4 border rounded-lg bg-gray-50">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Sản phẩm *</label>
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, 'productId', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    required
                    disabled={products.length === 0}
                  >
                    <option value="0">
                      {products.length === 0 ? 'Đang tải sản phẩm...' : 'Chọn sản phẩm'}
                    </option>
                    {products.map(product => (
                      <option 
                        key={product.id} 
                        value={product.id}
                        disabled={product.quantity === 0}
                      >
                        {product.name} - {formatPrice(product.price)}
                        {product.quantity === 0 && ' (Hết hàng)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-24">
                  <label className="block text-sm text-gray-600 mb-1">Số lượng *</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={item.productId === 0}
                  />
                </div>

                <div className="w-32">
                  <label className="block text-sm text-gray-600 mb-1">Đơn giá</label>
                  <input
                    type="text"
                    value={formatPrice(item.unitPrice)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    readOnly
                  />
                </div>

                <div className="w-32">
                  <label className="block text-sm text-gray-600 mb-1">Thành tiền</label>
                  <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">
                    {formatPrice(item.quantity * item.unitPrice)}
                  </div>
                </div>

                {formData.items.length > 1 && (
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            ))}

            {products.length === 0 && !dataLoading && (
              <p className="text-sm text-red-500 mt-2">
                Không có sản phẩm nào trong hệ thống. Vui lòng tạo sản phẩm trước.
              </p>
            )}
          </div>

          {/* Address Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ giao hàng
              </label>
              <textarea
                value={formData.shippingAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, shippingAddress: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Nhập địa chỉ giao hàng..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ hóa đơn
              </label>
              <textarea
                value={formData.billingAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, billingAddress: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Nhập địa chỉ hóa đơn..."
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phương thức thanh toán
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="COD">COD (Thanh toán khi nhận hàng)</option>
              <option value="BANKING">Chuyển khoản ngân hàng</option>
              <option value="CREDIT_CARD">Thẻ tín dụng</option>
            </select>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-lg font-semibold text-blue-800">Tổng cộng:</span>
            <span className="text-xl font-bold text-blue-600">
              {formatPrice(calculateTotal())}
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || customers.length === 0 || products.length === 0}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang tạo...' : 'Tạo đơn hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;