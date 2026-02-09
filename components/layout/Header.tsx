import Link from 'next/link';
import { t } from '@/lib/i18n';

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-slate-900 hover:text-slate-700">
            {t('site.name')}
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-slate-600 hover:text-slate-900">
              {t('nav.home')}
            </Link>
            <Link href="/properties" className="text-slate-600 hover:text-slate-900">
              {t('nav.properties')}
            </Link>
            <Link href="/admin" className="text-slate-500 text-sm hover:text-slate-700">
              {t('nav.admin')}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
