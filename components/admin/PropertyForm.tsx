'use client';

import { useState } from 'react';
import Image from 'next/image';
import { t } from '@/lib/i18n';
import { PropertyType } from '@prisma/client';
import type { Property, PropertyImage } from '@prisma/client';

const PROPERTY_TYPES = Object.values(PropertyType);

type ImageItem = { url: string; alt: string; sortOrder: number };

type Props = {
  action: (formData: FormData) => Promise<{ error?: Record<string, string[]> } | void>;
  property?: Property & { images: PropertyImage[] };
  submitLabel?: string;
};

export function PropertyForm({ action, property, submitLabel }: Props) {
  const [imageUrls, setImageUrls] = useState<ImageItem[]>(
    property?.images?.sort((a, b) => a.sortOrder - b.sortOrder).map((img) => ({ url: img.url, alt: img.alt ?? '', sortOrder: img.sortOrder })) ?? []
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Record<string, string[]>>({});
  const [submitStatus, setSubmitStatus] = useState<'Draft' | 'Published'>('Published');

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        setImageUrls((prev) => [...prev, { url: data.url, alt: property?.title ?? '', sortOrder: prev.length + i }]);
      }
    } catch (err) {
      setError((prev) => ({ ...prev, imageUrls: ['Upload failed. Try again.'] }));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function removeImage(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index).map((img, i) => ({ ...img, sortOrder: i })));
  }

  function moveImage(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= imageUrls.length) return;
    setImageUrls((prev) => {
      const arr = [...prev];
      [arr[index], arr[next]] = [arr[next], arr[index]];
      return arr.map((img, i) => ({ ...img, sortOrder: i }));
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError({});
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set('imageUrls', JSON.stringify(imageUrls.map((img) => img.url)));
    formData.set('status', submitStatus);
    const result = await action(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.title')} *</label>
        <input
          name="title"
          defaultValue={property?.title}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        {error.title?.[0] && <p className="text-sm text-red-600 mt-1">{error.title[0]}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.city')} *</label>
          <input name="city" defaultValue={property?.city} required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.neighborhood')}</label>
          <input name="neighborhood" defaultValue={property?.neighborhood ?? ''} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.addressLine')}</label>
        <input name="addressLine" defaultValue={property?.addressLine ?? ''} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.areaText')} *</label>
        <input name="areaText" defaultValue={property?.areaText} required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        {error.areaText?.[0] && <p className="text-sm text-red-600 mt-1">{error.areaText[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.propertyType')} *</label>
        <select name="propertyType" defaultValue={property?.propertyType} required className="w-full rounded-lg border border-slate-300 px-3 py-2">
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>{t(`propertyType.${type}`)}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.bedrooms')}</label>
          <input type="number" min={0} name="bedrooms" defaultValue={property?.bedrooms ?? ''} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.bathrooms')}</label>
          <input type="number" min={0} name="bathrooms" defaultValue={property?.bathrooms ?? ''} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.sizeSqm')}</label>
          <input type="number" min={0} name="sizeSqm" defaultValue={property?.sizeSqm ?? ''} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.lotSqm')}</label>
          <input type="number" min={0} name="lotSqm" defaultValue={property?.lotSqm ?? ''} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.price')}</label>
          <input type="number" min={0} step={1000} name="price" defaultValue={property?.price ?? ''} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.currency')}</label>
          <input name="currency" defaultValue={property?.currency ?? 'USD'} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" name="priceOnRequest" id="priceOnRequest" defaultChecked={property?.priceOnRequest ?? false} className="rounded border-slate-300" />
        <label htmlFor="priceOnRequest" className="text-sm text-slate-700">{t('form.priceOnRequest')}</label>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.features')}</label>
        <input
          name="features"
          defaultValue={property?.features?.join(', ') ?? ''}
          placeholder="Sea View, Pool, Elevator, Parking"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.description')} * (Markdown)</label>
        <textarea name="description" defaultValue={property?.description} required rows={8} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        {error.description?.[0] && <p className="text-sm text-red-600 mt-1">{error.description[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('form.slug')}</label>
        <input name="slug" defaultValue={property?.slug ?? ''} placeholder="Auto-generated from title + city" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" name="isFeatured" id="isFeatured" defaultChecked={property?.isFeatured ?? false} className="rounded border-slate-300" />
        <label htmlFor="isFeatured" className="text-sm text-slate-700">{t('form.isFeatured')}</label>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{t('admin.images')} *</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={uploading}
          className="block w-full text-sm text-slate-500 file:mr-4 file:rounded file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-primary-700"
        />
        {uploading && <p className="text-sm text-slate-500 mt-1">Uploading…</p>}
        {error.imageUrls?.[0] && <p className="text-sm text-red-600 mt-1">{error.imageUrls[0]}</p>}
        <div className="mt-4 flex flex-wrap gap-4">
          {imageUrls.map((img, i) => (
            <div key={i} className="relative group">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <Image src={img.url} alt={img.alt} fill className="object-cover" unoptimized={img.url.startsWith('/')} sizes="96px" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="rounded bg-white px-2 py-0.5 text-xs disabled:opacity-50">↑</button>
                <button type="button" onClick={() => moveImage(i, 1)} disabled={i === imageUrls.length - 1} className="rounded bg-white px-2 py-0.5 text-xs disabled:opacity-50">↓</button>
                <button type="button" onClick={() => removeImage(i)} className="rounded bg-red-500 text-white px-2 py-0.5 text-xs">×</button>
              </div>
            </div>
          ))}
        </div>
        {imageUrls.length === 0 && <p className="text-sm text-slate-500 mt-2">Upload at least one image.</p>}
      </div>

      <div className="flex flex-wrap gap-4">
        <button type="submit" onClick={() => setSubmitStatus('Draft')} className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">
          {t('admin.saveDraft')}
        </button>
        <button type="submit" onClick={() => setSubmitStatus('Published')} className="rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700">
          {t('admin.publish')}
        </button>
      </div>
    </form>
  );
}
