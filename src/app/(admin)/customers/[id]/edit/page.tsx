import CustomerForm from '../../CustomerForm';

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Edit Customer</h1>
      <CustomerForm id={Number(id)} />
    </section>
  );
}
