'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { t } from '@/lib/i18n';

type SearchParams = Record<string, string | undefined>;

export function Pagination({
  page,
  totalPages,
  basePath,
  searchParams,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams: SearchParams;
}) {
  const sp = useSearchParams();
  const current = new URLSearchParams(sp.toString());

  function href(p: number) {
    const params = new URLSearchParams(current.toString());
    params.set('page', String(p));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Pagination">
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {t('pagination.prev')}
        </Link>
      ) : (
        <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400 cursor-not-allowed">
          {t('pagination.prev')}
        </span>
      )}
      <span className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={href(page + 1)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {t('pagination.next')}
        </Link>
      ) : (
        <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400 cursor-not-allowed">
          {t('pagination.next')}
        </span>
      )}
    </nav>
  );
}
