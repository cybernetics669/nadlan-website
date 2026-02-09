import { Suspense } from 'react';
import { prisma } from '@/lib/db';
import { PropertyCard } from '@/components/property/PropertyCard';
import { FilterPanel } from '@/components/catalog/FilterPanel';
import { CatalogSort } from '@/components/catalog/CatalogSort';
import { Pagination } from '@/components/catalog/Pagination';
import { t } from '@/lib/i18n';
import { PropertyType } from '@prisma/client';
import type { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

const PER_PAGE = 12;

type SearchParams = {
  city?: string;
  propertyType?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  features?: string;
  sort?: string;
  page?: string;
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const skip = (page - 1) * PER_PAGE;

  const where: Prisma.PropertyWhereInput = {
    status: 'Published',
  };
  if (params.city) where.city = params.city;
  if (params.propertyType) where.propertyType = params.propertyType as PropertyType;
  const minP = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxP = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  if (minP != null || maxP != null) {
    where.price = {};
    if (minP != null) (where.price as { gte?: number }).gte = minP;
    if (maxP != null) (where.price as { lte?: number }).lte = maxP;
  }
  if (params.bedrooms) where.bedrooms = { gte: parseInt(params.bedrooms, 10) };
  if (params.features) {
    const tags = params.features.split(',').filter(Boolean);
    if (tags.length) where.features = { hasEvery: tags };
  }

  const orderBy =
    params.sort === 'priceAsc'
      ? { price: 'asc' as const }
      : params.sort === 'priceDesc'
        ? { price: 'desc' as const }
        : params.sort === 'sizeDesc'
          ? { sizeSqm: 'desc' as const }
          : { updatedAt: 'desc' as const };

  const [properties, total, cities] = await Promise.all([
    prisma.property.findMany({
      where,
      include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
      orderBy,
      skip,
      take: PER_PAGE,
    }),
    prisma.property.count({ where }),
    prisma.property.findMany({ where: { status: 'Published' }, select: { city: true }, distinct: ['city'], orderBy: { city: 'asc' } }).then((r) => r.map((x) => x.city)),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <FilterPanel cities={cities} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-slate-900">{t('catalog.title')}</h1>
            <Suspense fallback={null}>
              <CatalogSort currentSort={params.sort} />
            </Suspense>
          </div>
          <p className="text-slate-600 mb-6">
            {total} {t('catalog.results')}
          </p>
          {properties.length === 0 ? (
            <p className="text-slate-500 py-12">{t('catalog.noResults')}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination page={page} totalPages={totalPages} basePath="/properties" searchParams={params} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
