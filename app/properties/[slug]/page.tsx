import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { PropertyMap } from '@/components/property/PropertyMap';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { InquiryForm } from '@/components/property/InquiryForm';
import { PropertyCard } from '@/components/property/PropertyCard';
import { t } from '@/lib/i18n';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await prisma.property.findUnique({
    where: { slug, status: 'Published' },
    select: { title: true, city: true, neighborhood: true, description: true, price: true, priceOnRequest: true, currency: true },
  });
  if (!property) return { title: 'Property not found' };
  const location = [property.city, property.neighborhood].filter(Boolean).join(', ');
  const priceText = property.priceOnRequest
    ? 'Price on request'
    : property.price != null
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: property.currency, maximumFractionDigits: 0 }).format(property.price)
      : '';
  const description = property.description.replace(/#{1,6}\s?/g, '').slice(0, 160);
  return {
    title: `${property.title} – ${location}`,
    description: description || `${property.title} in ${location}. ${priceText}`,
    openGraph: {
      title: `${property.title} – ${location}`,
      description: description || `${property.title} in ${location}`,
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = await prisma.property.findUnique({
    where: { slug, status: 'Published' },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!property) notFound();

  const similar = await prisma.property.findMany({
    where: {
      status: 'Published',
      id: { not: property.id },
      OR: [
        { propertyType: property.propertyType },
        { city: property.city },
      ],
    },
    include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
    take: 3,
    orderBy: { updatedAt: 'desc' },
  });

  const location = [property.city, property.neighborhood].filter(Boolean).join(', ');
  const priceLabel = property.priceOnRequest
    ? t('card.priceOnRequest')
    : property.price != null
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: property.currency,
          maximumFractionDigits: 0,
        }).format(property.price)
      : t('card.priceOnRequest');


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <PropertyGallery images={property.images} />
          <div className="border-b border-slate-200 pb-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-serif font-medium text-slate-900 tracking-tight">{property.title}</h1>
                <p className="text-lg text-slate-500 font-light">{location}</p>
              </div>
              <div className="md:text-right">
                <p className="text-3xl text-slate-900 font-light tracking-tight">{priceLabel}</p>
              </div>
            </div>
          </div>

          <section className="py-2 border-b border-slate-200 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <dt className="text-xs uppercase tracking-widest text-slate-500 mb-1">Type</dt>
                <dd className="text-xl font-medium text-slate-900">{t(`propertyType.${property.propertyType}`)}</dd>
              </div>
              {property.bedrooms != null && (
                <div>
                  <dt className="text-xs uppercase tracking-widest text-slate-500 mb-1">{t('card.beds')}</dt>
                  <dd className="text-xl font-medium text-slate-900">{property.bedrooms}</dd>
                </div>
              )}
              {property.bathrooms != null && (
                <div>
                  <dt className="text-xs uppercase tracking-widest text-slate-500 mb-1">{t('card.baths')}</dt>
                  <dd className="text-xl font-medium text-slate-900">{property.bathrooms}</dd>
                </div>
              )}
              {property.sizeSqm != null && (
                <div>
                  <dt className="text-xs uppercase tracking-widest text-slate-500 mb-1">{t('card.sqm')}</dt>
                  <dd className="text-xl font-medium text-slate-900">{property.sizeSqm}</dd>
                </div>
              )}
              {property.lotSqm != null && (
                <div>
                  <dt className="text-xs uppercase tracking-widest text-slate-500 mb-1">{t('card.lot')}</dt>
                  <dd className="text-xl font-medium text-slate-900">{property.lotSqm} m²</dd>
                </div>
              )}
            </div>
          </section>

          {property.features.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('detail.features')}</h2>
              <ul className="flex flex-wrap gap-2">
                {property.features.map((f) => (
                  <li key={f} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('detail.description')}</h2>
            <div
              className="prose-md text-slate-700 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: property.description
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br />'),
              }}
            />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('detail.location')}</h2>
            <PropertyMap address={[property.addressLine, property.neighborhood, property.city, 'Israel'].filter(Boolean).join(', ')} />
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <InquiryForm propertyId={property.id} propertyTitle={property.title} />
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-16 pt-12 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('detail.similar')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
