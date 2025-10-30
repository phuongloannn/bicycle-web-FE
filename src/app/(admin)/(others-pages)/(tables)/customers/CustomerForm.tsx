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
  const router = useRouter();

  // 🧠 Load existing customer if editing
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await CustomerService.get(id);
        setForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
        });
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
    try {
      if (id) {
        await CustomerService.update(id, form);
      } else {
        await CustomerService.create(form);
      }
      router.push('/customers'); // ✅ go back to list
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow space-y-4"
    >
      <h2 className="text-xl font-semibold">
        {id ? 'Edit Customer' : 'Add New Customer'}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <input
          className="border p-2 rounded"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 rounded"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 rounded"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : id ? 'Update Customer' : 'Create Customer'}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => router.push('/customers')}
      >
        Cancel
      </Button>
    </form>
  );
}
