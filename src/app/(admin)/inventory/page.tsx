'use client';

import React, { useEffect, useState } from 'react';
import {
  InventoryItem,
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  buildInventoryExportUrl,
} from '@/lib/api/inventory';
import { getProducts, Product } from '@/lib/api/products';
import { getCategories, Category } from '@/lib/api/categories';

interface InventoryFormState {
  id: number | null;
  productId: number | '';
  categoryId: number | '';
  quantity: number | '';
  reserved: number | '';
  minStock: number | '';
  location: string;
}

const initialFormState: InventoryFormState = {
  id: null,
  productId: '',
  categoryId: '',
  quantity: '',
  reserved: '',
  minStock: '',
  location: '',
};

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<InventoryFormState>(initialFormState);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [inv, prods, cats] = await Promise.all([
        getInventory(),
        getProducts(),
        getCategories(),
      ]);
      setItems(inv);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => setForm(initialFormState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!form.productId || form.productId === 0) {
        setError('Product is required');
        setSaving(false);
        return;
      }

      const payload = {
        product_id: Number(form.productId),
        category_id:
          form.categoryId === '' ? undefined : Number(form.categoryId),
        quantity:
          form.quantity === '' ? 0 : Number(form.quantity),
        reserved:
          form.reserved === '' ? undefined : Number(form.reserved),
        min_stock:
          form.minStock === '' ? undefined : Number(form.minStock),
        location: form.location.trim() || undefined,
      };

      if (form.id) {
        await updateInventoryItem(form.id, payload);
      } else {
        await createInventoryItem(payload);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save inventory item',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setForm({
      id: item.id,
      productId: item.product?.id ?? '',
      categoryId: item.category?.id ?? '',
      quantity: item.quantity,
      reserved: item.reserved,
      minStock: item.min_stock,
      location: item.location ?? '',
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inventory record?')) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await deleteInventoryItem(id);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete inventory item',
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      item.product?.name.toLowerCase().includes(s) ||
      item.category?.name.toLowerCase().includes(s) ||
      (item.location ?? '').toLowerCase().includes(s)
    );
  });

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* HEADER */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#8B278C] mb-2">
          📦 Inventory Management
        </h1>
        <p className="text-[#B673BF] text-lg">
          Track stock per product and category
        </p>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900 font-bold text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by product, category or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900 placeholder-gray-400"
          />
          <div className="absolute right-3 top-3">
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#8B278C]" />
            ) : (
              <svg
                className="w-5 h-5 text-[#B673BF]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>
        </div>
        {search && (
          <p className="mt-2 text-sm text-[#8B278C]">
            Found {filteredItems.length} records for &quot;{search}&quot;
          </p>
        )}
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-[#D2A0D9]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#8B278C]">
            {form.id ? '✏️ Edit Inventory' : '➕ Add Inventory Record'}
          </h2>
          {form.id && (
            <button
              onClick={resetForm}
              className="px-4 py-2 text-sm text-[#8B278C] hover:text-[#B673BF] transition-colors"
            >
              ↶ Cancel edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#8B278C] mb-2">
                Product *
              </label>
              <select
                value={form.productId}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    productId: e.target.value === '' ? '' : Number(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900"
                required
              >
                <option value="">-- Select product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#8B278C] mb-2">
                Category (optional)
              </label>
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    categoryId:
                      e.target.value === '' ? '' : Number(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900"
              >
                <option value="">-- Any category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#8B278C] mb-2">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, location: e.target.value }))
                }
                className="w-full px-4 py-3 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900"
                placeholder="e.g., Main warehouse A1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#8B278C] mb-2">
                Quantity *
              </label>
              <input
                type="number"
                min={0}
                value={form.quantity}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    quantity: e.target.value === '' ? '' : Number(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900"
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#8B278C] mb-2">
                Reserved
              </label>
              <input
                type="number"
                min={0}
                value={form.reserved}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    reserved: e.target.value === '' ? '' : Number(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#8B278C] mb-2">
                Min stock
              </label>
              <input
                type="number"
                min={0}
                value={form.minStock}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    minStock: e.target.value === '' ? '' : Number(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-[#8B278C] to-[#B673BF] text-white font-semibold rounded-xl hover:from-[#B673BF] hover:to-[#8B278C] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving
                ? 'Saving...'
                : form.id
                ? '💾 Update Inventory'
                : '✨ Add Inventory'}
            </button>

            {form.id && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border-2 border-[#B673BF] text-[#8B278C] font-semibold rounded-xl hover:bg-[#F2D8EE] transition-all duration-200"
              >
                ❌ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-[#D2A0D9] bg-gradient-to-r from-[#8B278C] to-[#B673BF]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              📊 Inventory List ({filteredItems.length})
            </h2>
            <a
              href={buildInventoryExportUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white text-[#8B278C] font-semibold rounded-lg hover:bg-[#F2D8EE] transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Excel
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F2D8EE]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Reserved
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Min stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#F2D8EE]">
              {filteredItems.map((item) => {
                const free =
                  item.quantity - item.reserved < 0
                    ? 0
                    : item.quantity - item.reserved;
                const belowMin =
                  item.min_stock > 0 && free < item.min_stock;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F2D8EE] transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-[#8B278C]">
                          {item.product?.name ?? 'Unknown product'}
                        </span>
                        <span className="text-xs text-gray-500">
                          ID: {item.product?.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#F2D8EE] text-[#8B278C] border border-[#D2A0D9]">
                        {item.category?.name ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {item.reserved}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          belowMin
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}
                      >
                        {item.min_stock} (free: {free})
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {item.location ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1 bg-[#8B278C] text-white text-sm rounded-lg hover:bg-[#B673BF] transition-colors duration-200"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors duration-200"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-[#8B278C] mb-2">
              No inventory records
            </h3>
            <p className="text-[#B673BF]">
              Start by adding an inventory record for a product.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


