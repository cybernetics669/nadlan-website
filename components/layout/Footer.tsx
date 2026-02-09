import Link from 'next/link';
import { t } from '@/lib/i18n';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-semibold text-slate-800 hover:text-slate-600">
            {t('site.name')}
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-slate-600 hover:text-slate-800 text-sm">
              {t('nav.home')}
            </Link>
            <Link href="/properties" className="text-slate-600 hover:text-slate-800 text-sm">
              {t('nav.properties')}
            </Link>
          </div>
        </div>
        <p className="mt-4 text-center sm:text-left text-slate-500 text-sm">
          © {new Date().getFullYear()} {t('site.name')}. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
