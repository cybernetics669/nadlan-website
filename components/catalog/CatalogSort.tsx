'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { t } from '@/lib/i18n';

const OPTIONS = [
  { value: '', label: t('catalog.sort.newest') },
  { value: 'priceAsc', label: t('catalog.sort.priceAsc') },
  { value: 'priceDesc', label: t('catalog.sort.priceDesc') },
  { value: 'sizeDesc', label: t('catalog.sort.sizeDesc') },
];

export function CatalogSort({ currentSort }: { currentSort?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function changeSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('sort', value);
    else params.delete('sort');
    params.set('page', '1');
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-slate-600">{t('catalog.sort')}</span>
      <select
        value={currentSort ?? ''}
        onChange={(e) => changeSort(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2 bg-white"
      >
        {OPTIONS.map((o) => (
          <option key={o.value || 'newest'} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
