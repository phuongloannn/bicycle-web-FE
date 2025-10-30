// Đường dẫn này phải chính xác
import StoreHeader from '../../components/store/StoreHeader';
import StoreFooter from '../../components/store/StoreFooter';
// Note: Dùng '../../components' thay vì '../components'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader />
      <main>{children}</main>
      <StoreFooter />
    </div>
  );
}