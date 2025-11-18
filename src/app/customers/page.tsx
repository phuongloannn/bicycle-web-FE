'use client';
import { getServerToken } from '@/lib/auth.server';
import { redirect } from 'next/navigation';
import CustomerTable from './CustomerTable';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useRouter } from 'next/navigation';

export default async function CustomersPage() {
  // const token = await getServerToken();
  // if (!token) redirect('/signin');
  const router = useRouter();
  return (
    <section className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <PageBreadcrumb pageTitle="Customer List" />
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={()=>router.push('/customers/add')}>
          + Add Customer
        </button>
      </header>
      <ComponentCard title="Customer">
      <CustomerTable />
      </ComponentCard>
    </section>
  );
}