'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { t } from '@/lib/i18n';
import { PropertyType } from '@prisma/client';

const PROPERTY_TYPES = Object.values(PropertyType);
const FEATURES_OPTIONS = ['Sea View', 'Pool', 'Elevator', 'Parking', 'Renovated', 'Safe Room', 'Balcony', 'Garden'];

type FilterState = {
  city?: string;
  propertyType?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  features?: string[];
  sort?: string;
};

export function FilterPanel({ cities }: { cities: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getFilter = (key: string) => searchParams.get(key) ?? undefined;
  const getFeatures = () => {
    const f = searchParams.get('features');
    return f ? f.split(',') : [];
  };

  function updateFilters(updates: Partial<FilterState>) {
    const params = new URLSearchParams(searchParams.toString());
    (Object.keys(updates) as (keyof FilterState)[]).forEach((key) => {
      const v = updates[key];
      if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(v)) {
        params.set(key, v.join(','));
      } else {
        params.set(key, String(v));
      }
    });
    params.set('page', '1');
    router.push(`/properties?${params.toString()}`);
  }

  const toggleFeature = (feature: string) => {
    const current = getFeatures();
    const next = current.includes(feature)
      ? current.filter((x) => x !== feature)
      : [...current, feature];
    updateFilters({ features: next.length ? next : undefined });
  };

  const clearAll = () => router.push('/properties');

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{t('catalog.filters')}</h3>
        <button
          type="button"
          onClick={clearAll}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          {t('catalog.clearFilters')}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.city')}</label>
        <select
          value={getFilter('city') ?? ''}
          onChange={(e) => updateFilters({ city: e.target.value || undefined })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.propertyType')}</label>
        <select
          value={getFilter('propertyType') ?? ''}
          onChange={(e) => updateFilters({ propertyType: e.target.value || undefined })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>{t(`propertyType.${type}`)}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Min price</label>
          <input
            type="number"
            min={0}
            placeholder="0"
            value={getFilter('minPrice') ?? ''}
            onChange={(e) => updateFilters({ minPrice: e.target.value || undefined })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Max price</label>
          <input
            type="number"
            min={0}
            placeholder="Any"
            value={getFilter('maxPrice') ?? ''}
            onChange={(e) => updateFilters({ maxPrice: e.target.value || undefined })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.bedrooms')}</label>
        <select
          value={getFilter('bedrooms') ?? ''}
          onChange={(e) => updateFilters({ bedrooms: e.target.value || undefined })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}+</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{t('form.features')}</label>
        <div className="flex flex-wrap gap-2">
          {FEATURES_OPTIONS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => toggleFeature(f)}
              className={`rounded-full px-3 py-1 text-sm border transition-colors ${
                getFeatures().includes(f)
                  ? 'bg-primary-100 border-primary-300 text-primary-800'
                  : 'border-slate-300 text-slate-600 hover:border-slate-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
