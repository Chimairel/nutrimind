"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, BookHeart, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: ShoppingCart, label: 'Grocery', href: '/grocery' },
    { icon: BookHeart, label: 'Meals', href: '/meals' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-16 w-full max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link key={item.label} href={item.href} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icon size={22} className={isActive ? 'fill-green-100' : ''} />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
