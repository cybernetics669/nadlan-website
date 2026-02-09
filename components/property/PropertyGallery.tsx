'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { PropertyImage as PImage } from '@prisma/client';

const placeholder = 'https://placehold.co/800x500/e2e8f0/64748b?text=Property';

export function PropertyGallery({ images }: { images: PImage[] }) {
  const [selected, setSelected] = useState(0);
  const list = images.length ? images.sort((a, b) => a.sortOrder - b.sortOrder) : [{ id: '0', url: placeholder, alt: 'Property', sortOrder: 0, propertyId: '' }];
  const current = list[selected];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
        <Image
          src={current.url}
          alt={current.alt ?? 'Property'}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 70vw"
          unoptimized={current.url.startsWith('/uploads')}
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholder;
          }}
        />
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {list.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelected(i)}
              className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                i === selected ? 'border-primary-500' : 'border-transparent hover:border-slate-300'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `Thumb ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized={img.url.startsWith('/uploads')}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
