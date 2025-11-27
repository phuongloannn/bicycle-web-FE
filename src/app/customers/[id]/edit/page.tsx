import CustomerForm from '../../CustomerForm';

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  const customerId = Number(params.id); // ✅ Không dùng await

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Edit Customer</h1>
      <CustomerForm id={customerId} />
    </section>
  );
}
