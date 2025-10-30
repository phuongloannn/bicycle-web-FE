import CustomerForm from '../../CustomerForm';

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Edit Customer</h1>
      <CustomerForm id={id} />
    </section>
  );
}
