'use client';
import { useEffect, useState } from 'react';
import { CustomerService } from '@/services/CustomerService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export default function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    console.log('🔧 [CustomerTable] Component mounted');
    
    // ✅ KIỂM TRA TOKEN TRƯỚC KHI LOAD
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('🔧 [CustomerTable] Token exists:', !!token);
    console.log('🔧 [CustomerTable] User exists:', !!user);
    console.log('🔧 [CustomerTable] Full token:', token);
    console.log('🔧 [CustomerTable] Full user:', user);
    
    if (!token) {
      console.log('❌ [CustomerTable] No token found, redirecting to login...');
      window.location.href = '/signin';
      return;
    }
    
    loadCustomers();
  }, []);

  // Load customers
  const loadCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔧 [CustomerTable] STEP 1: Calling CustomerService.list()...');
      
      const response = await CustomerService.list();
      console.log('✅ [CustomerTable] STEP 2: API Response:', response);
      
      // 🔍 DEBUG: Kiểm tra cấu trúc response
      console.log('🔧 [CustomerTable] STEP 3: Response keys:', Object.keys(response));
      console.log('🔧 [CustomerTable] STEP 4: Response type:', typeof response);
      console.log('🔧 [CustomerTable] STEP 5: Is array?', Array.isArray(response));
      
      // ✅ Thử các cách extract data
      let data = response;
      
      if (response && typeof response === 'object') {
        // Thử response.data
        if (response.data !== undefined) {
          console.log('📊 [CustomerTable] Found response.data');
          data = response.data;
        }
        // Thử response.customers
        else if (response.customers !== undefined) {
          console.log('📊 [CustomerTable] Found response.customers');
          data = response.customers;
        }
        // Thử response.items
        else if (response.items !== undefined) {
          console.log('📊 [CustomerTable] Found response.items');
          data = response.items;
        }
        // Thử response trực tiếp nếu là array
        else if (Array.isArray(response)) {
          console.log('📊 [CustomerTable] Response is already array');
          data = response;
        }
      }
      
      console.log('✅ [CustomerTable] STEP 6: Final data to display:', data);
      console.log('✅ [CustomerTable] STEP 7: Data is array?', Array.isArray(data));
      console.log('✅ [CustomerTable] STEP 8: Data length:', Array.isArray(data) ? data.length : 'not array');
      
      if (Array.isArray(data)) {
        setCustomers(data);
        console.log('✅ [CustomerTable] Customers set successfully:', data.length, 'items');
      } else {
        console.warn('❌ [CustomerTable] Data is not an array:', data);
        setError('Invalid data format from server');
        setCustomers([]);
      }
      
    } catch (error: any) {
      console.error('❌ [CustomerTable] STEP 9: Error loading customers:', error);
      setError(error.message || 'Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this customer?');
    if (!confirmed) return;

    try {
      await CustomerService.remove(id);
      alert('Customer deleted successfully.');
      loadCustomers();
    } catch (error) {
      console.error('Failed to delete customer:', error);
      alert('Error deleting customer.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading customers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-700 font-medium">Error loading customers</div>
        <div className="text-red-600 text-sm mt-1">{error}</div>
        <button 
          onClick={loadCustomers}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
        <button 
          onClick={() => window.location.href = '/signin'}
          className="mt-2 ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Customer List
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={loadCustomers}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Refresh
          </button>
          <Link 
            href="/customers/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add Customer
          </Link>
        </div>
      </div>
      
      <div className="p-4 border-b">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total: {customers.length} customers
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <div>No customers found.</div>
                    <Link 
                      href="/customers/add"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      Add your first customer
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {customer.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {customer.address || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => router.push(`/customers/${customer.id}/edit`)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}