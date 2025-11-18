'use client';
import { logout } from '@/lib/auth.client';

export default function SignOutButton() {
  const handleLogout = () => {
    logout(); // ✅ clear token + redirect
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md"
    >
      Sign Out
    </button>
  );
}
