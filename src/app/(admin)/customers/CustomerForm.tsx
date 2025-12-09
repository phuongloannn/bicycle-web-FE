'use client';
import { useState, useEffect } from 'react';
import { CustomerService } from '@/services/CustomerService';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button/Button';

interface CustomerFormProps {
  id?: number; // if editing
}

export default function CustomerForm({ id }: CustomerFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // 🧠 Load existing customer if editing
  useEffect(() => {
    if (!id) return;
    
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('📡 Fetching customer with ID:', id);
        const response = await CustomerService.get(id) as any;
        console.log('✅ Full API Response:', response);
        
        // ✅ FIX: Extract data from response
        const customerData = (response as any)?.data || response;
        console.log('📦 Customer Data:', customerData);
        
        setForm({
          name: customerData.name || '',
          email: customerData.email || '',
          phone: customerData.phone || '',
          address: customerData.address || '',
        });
        
        console.log('✅ Form populated successfully');
      } catch (err: any) {
        console.error('❌ Error loading customer:', err);
        setError(err.message || 'Failed to load customer data');
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (id) {
        await CustomerService.update(id, form);
        alert('Customer updated successfully!');
      } else {
        await CustomerService.create(form);
        alert('Customer created successfully!');
      }
      router.push('/customers'); // ✅ go back to list
    } catch (err: any) {
      console.error('❌ Error saving customer:', err);
      setError(err.message || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-600">Loading customer data...</div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow space-y-4"
    >
      <h2 className="text-xl font-semibold">
        {id ? 'Edit Customer' : 'Add New Customer'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="name"
            placeholder="Enter customer name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            name="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="tel"
            name="phone"
            placeholder="0123456789"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="address"
            placeholder="Enter address"
            value={form.address}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : id ? 'Update Customer' : 'Create Customer'}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/customers')}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}