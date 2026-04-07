'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Start', icon: '🏠' },
  { href: '/lernen', label: 'Lernen', icon: '📚' },
  { href: '/einsatz', label: 'Einsatz', icon: '🚨' },
  { href: '/abzeichen', label: 'Abzeichen', icon: '🏅' },
  { href: '/fortschritt', label: 'Fortschritt', icon: '📊' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="max-w-lg mx-auto flex justify-around">
        {navItems.map(item => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center py-2 px-3 text-xs transition-colors',
                isActive ? 'text-fire-red font-bold' : 'text-gray-500'
              )}
            >
              <span className="text-xl mb-0.5">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
