'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { t } from '@/lib/i18n';

export function AdminNav() {
  const pathname = usePathname();
  if (pathname === '/admin' || !pathname?.startsWith('/admin')) return null;

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-6">
          <Link href="/admin/dashboard" className="font-semibold text-slate-900">
            {t('site.name')} – {t('admin.dashboard')}
          </Link>
          <Link href="/admin/properties" className="text-slate-600 hover:text-slate-900 text-sm">
            {t('admin.properties')}
          </Link>
          <Link href="/admin/properties/new" className="text-slate-600 hover:text-slate-900 text-sm">
            {t('admin.addProperty')}
          </Link>
          <Link href="/" className="ml-auto text-slate-500 hover:text-slate-700 text-sm">
            View site →
          </Link>
        </div>
      </div>
    </nav>
  );
}
