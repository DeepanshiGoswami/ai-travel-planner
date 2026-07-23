'use client'
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">✈️ AI Travel Planner</Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <Link href="/trips/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">New Trip</Link>
              <button onClick={logout} className="text-gray-700 hover:text-blue-600">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
