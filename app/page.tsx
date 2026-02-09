import Link from 'next/link';
import { t } from '@/lib/i18n';
import { prisma } from '@/lib/db';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyType } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featured, countsByType] = await Promise.all([
    prisma.property.findMany({
      where: { status: 'Published', isFeatured: true },
      include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
      take: 6,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.property.groupBy({
      by: ['propertyType'],
      where: { status: 'Published' },
      _count: true,
    }),
  ]);

  const categories = Object.values(PropertyType).map((type) => ({
    type,
    count: countsByType.find((c) => c.propertyType === type)?._count ?? 0,
  }));

  return (
    <div>
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t('home.hero.title')}
          </h1>
          <p className="mt-4 text-xl text-slate-300">
            {t('home.hero.subtitle')}
          </p>
          <Link
            href="/properties"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100"
          >
            {t('home.viewAll')}
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">{t('home.featured')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
        {featured.length === 0 && (
          <p className="text-slate-500">No featured listings yet. Check back soon.</p>
        )}
        <div className="mt-12 text-center">
          <Link href="/properties" className="text-primary-600 font-medium hover:underline">
            {t('home.viewAll')}
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">{t('home.categories')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(({ type, count }) => (
            <Link
              key={type}
              href={`/properties?propertyType=${type}`}
              className="rounded-xl border border-slate-200 bg-white p-4 text-center hover:border-primary-300 hover:shadow-sm transition-shadow"
            >
              <span className="font-medium text-slate-900 block">{t(`propertyType.${type}`)}</span>
              <span className="text-sm text-slate-500">{count}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
