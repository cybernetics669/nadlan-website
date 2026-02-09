'use client';

import Link from 'next/link';
import Image from 'next/image';
import { t } from '@/lib/i18n';
import type { Property } from '@prisma/client';
import type { PropertyImage } from '@prisma/client';

type PropertyWithImages = Property & { images: PropertyImage[] };

const placeholder = 'https://placehold.co/600x400/e2e8f0/64748b?text=Property';

export function PropertyCard({ property }: { property: PropertyWithImages }) {
  const cover = property.images?.[0]?.url ?? placeholder;
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
    <Link
      href={`/properties/${property.slug}`}
      className="group block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <Image
          src={cover}
          alt={property.images?.[0]?.alt ?? property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={cover.startsWith('/uploads')}
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholder;
          }}
        />
        {property.isFeatured && (
          <span className="absolute top-3 left-3 rounded-full bg-amber-500/90 px-2 py-0.5 text-xs font-medium text-white">
            Featured
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 line-clamp-2">
          {property.title}
        </h3>
        <p className="text-sm text-slate-500 mt-0.5">{location}</p>
        <p className="mt-2 text-lg font-semibold text-slate-800">{priceLabel}</p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-600">
          <span>{t(`propertyType.${property.propertyType}`)}</span>
          {property.bedrooms != null && <span>{property.bedrooms} {t('card.beds')}</span>}
          {property.bathrooms != null && <span>{property.bathrooms} {t('card.baths')}</span>}
          {property.sizeSqm != null && <span>{property.sizeSqm} {t('card.sqm')}</span>}
        </div>
      </div>
    </Link>
  );
}
