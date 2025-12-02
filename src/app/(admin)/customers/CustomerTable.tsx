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
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔧 [CustomerTable] Calling CustomerService.list()...');
      
      const response = await CustomerService.list();
      console.log('✅ [CustomerTable] API Response:', response);
      
      // ✅ Extract data từ response
      let data = response.data || response;
      
      console.log('✅ [CustomerTable] Final data:', data);
      console.log('✅ [CustomerTable] Data is array?', Array.isArray(data));
      
      if (Array.isArray(data)) {
        setCustomers(data);
        console.log('✅ [CustomerTable] Customers set successfully:', data.length, 'items');
      } else {
        console.warn('❌ [CustomerTable] Data is not an array:', data);
        setError('Invalid data format from server');
        setCustomers([]);
      }
      
    } catch (error: any) {
      console.error('❌ [CustomerTable] Error loading customers:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load customers');
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
      alert('✅ Customer deleted successfully.');
      loadCustomers();
    } catch (error: any) {
      console.error('Failed to delete customer:', error);
      alert('❌ Error deleting customer: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-lg border border-[#D2A0D9] p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B278C] mb-4"></div>
        <div className="text-[#8B278C] font-semibold text-lg">Loading customers...</div>
        <div className="text-[#B673BF] text-sm mt-1">Please wait a moment</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center mb-3">
          <svg className="w-6 h-6 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-red-700 font-semibold text-lg">Error loading customers</div>
        </div>
        <div className="text-red-600 mb-4">{error}</div>
        <div className="flex gap-3">
          <button 
            onClick={loadCustomers}
            className="px-4 py-2 bg-[#8B278C] text-white rounded-xl hover:bg-[#B673BF] transition-colors duration-200 font-medium"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#D2A0D9] overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-[#D2A0D9] bg-gradient-to-r from-[#8B278C] to-[#B673BF]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-2xl font-bold text-white mb-2">
              👥 Customer Management
            </h2>
            <p className="text-white/80">
              Manage your customer database efficiently
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={loadCustomers}
              className="px-5 py-2.5 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-200 font-semibold border border-white/30 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <Link 
              href="/customers/add"
              className="px-5 py-2.5 bg-white text-[#8B278C] rounded-xl hover:bg-[#F2D8EE] transition-all duration-200 font-semibold border border-white flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Customer
            </Link>
          </div>
        </div>
      </div>
      
      {/* SUMMARY */}
      <div className="p-4 border-b border-[#F2D8EE] bg-[#F2D8EE]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#8B278C] rounded-full"></div>
            <span className="text-[#8B278C] font-semibold">
              Total: {customers.length} customer{customers.length !== 1 ? 's' : ''}
            </span>
          </div>
          {customers.length > 0 && (
            <div className="text-[#B673BF] text-sm">
              Click on a customer to view details
            </div>
          )}
        </div>
      </div>
      
      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F2D8EE]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider border-b border-[#D2A0D9]">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider border-b border-[#D2A0D9]">
                Contact Info
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider border-b border-[#D2A0D9]">
                Address
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider border-b border-[#D2A0D9]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#F2D8EE]">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-[#F2D8EE] rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#B673BF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#8B278C] mb-1">No customers found</h3>
                      <p className="text-[#B673BF] mb-4">Get started by adding your first customer</p>
                      <Link 
                        href="/customers/add"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#8B278C] text-white rounded-xl hover:bg-[#B673BF] transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add First Customer
                      </Link>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-[#F2D8EE] transition-colors duration-200 group">
                  {/* Customer Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#8B278C] to-[#B673BF] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-base font-semibold text-[#8B278C] group-hover:text-[#B673BF] transition-colors">
                          {customer.name}
                        </div>
                        <div className="text-sm text-[#B673BF]">ID: {customer.id}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Contact Info */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#B673BF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-700">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#B673BF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-sm text-gray-700">{customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Address */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2 max-w-xs">
                      <svg className="w-4 h-4 text-[#B673BF] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-gray-700">
                        {customer.address || (
                          <span className="text-[#B673BF] italic">No address provided</span>
                        )}
                      </span>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/customers/${customer.id}/edit`)}
                        className="px-4 py-2 bg-[#8B278C] text-white text-sm rounded-lg hover:bg-[#B673BF] transition-colors duration-200 font-medium flex items-center gap-2"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium flex items-center gap-2"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      {customers.length > 0 && (
        <div className="p-4 border-t border-[#F2D8EE] bg-[#F2D8EE]">
          <div className="flex justify-between items-center">
            <div className="text-[#8B278C] text-sm font-medium">
              Showing {customers.length} customer{customers.length !== 1 ? 's' : ''}
            </div>
            <div className="text-[#B673BF] text-sm">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}