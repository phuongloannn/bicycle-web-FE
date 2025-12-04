'use client';

import React, { useEffect, useState } from 'react';
import {
  Category,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/api/categories';

interface CategoryFormState {
  id: number | null;
  name: string;
  slug: string;
  is_active: boolean;
}

const initialFormState: CategoryFormState = {
  id: null,
  name: '',
  slug: '',
  is_active: true,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormState>(initialFormState);
  const [search, setSearch] = useState('');

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load categories',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setForm(initialFormState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        // Gửi boolean để khớp với DTO backend
        is_active: form.is_active,
      };

      if (!payload.name) {
        setError('Category name is required');
        setSaving(false);
        return;
      }

      if (form.id) {
        await updateCategory(form.id, payload);
      } else {
        await createCategory(payload);
      }

      resetForm();
      await loadCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save category',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setForm({
      id: category.id,
      name: category.name,
      slug: category.slug,
      // Ép kiểu sang boolean để khi update luôn gửi boolean lên BE
      is_active: Boolean(category.is_active),
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setSaving(true);
    setError(null);
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (err) {
      // Extract error message
      console.log(err, 1111);
      window.alert(
        `Cannot delete category. This category is associated with one or more products. Please remove or reassign products first.`
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter((c) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(s) ||
      c.slug.toLowerCase().includes(s)
    );
  });

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* HEADER */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#8B278C] mb-2">
          📂 Category Management
        </h1>
        <p className="text-[#B673BF] text-lg">
          Create, edit, and delete product categories
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
            placeholder="Search by name or slug..."
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
            Found {filteredCategories.length} categories for keyword &quot;
            {search}
            &quot;
          </p>
        )}
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-[#D2A0D9]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#8B278C]">
            {form.id ? '✏️ Edit Category' : '➕ Add New Category'}
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
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#8B278C] mb-2">
                Category name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-3 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900 placeholder-gray-400"
                placeholder="e.g., Glasses"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#8B278C] mb-2">
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full px-4 py-3 border border-[#D2A0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B278C] bg-white text-gray-900 placeholder-gray-400"
                placeholder="mat-kinh"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, is_active: e.target.checked }))
                }
                className="w-5 h-5 text-[#8B278C] border-[#D2A0D9] rounded focus:ring-[#8B278C]"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Active
              </span>
            </label>
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
                ? '💾 Update Category'
                : '✨ Add Category'}
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
          <h2 className="text-2xl font-bold text-white">
            📋 Category list ({filteredCategories.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F2D8EE]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Created at
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B278C] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#F2D8EE]">
              {filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-[#F2D8EE] transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="text-base font-semibold text-[#8B278C]">
                      {category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">
                      {category.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        category.is_active
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {category.created_at
                        ? new Date(category.created_at).toLocaleString('vi-VN')
                        : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="px-3 py-1 bg-[#8B278C] text-white text-sm rounded-lg hover:bg-[#B673BF] transition-colors duration-200"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors duration-200"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCategories.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-[#8B278C] mb-2">
              No categories yet
            </h3>
            <p className="text-[#B673BF]">
              Start by adding your first category!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


