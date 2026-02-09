'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { propertySchema } from '@/lib/validations';
import { slugify } from '@/lib/slug';
import { PropertyType, PropertyStatus } from '@prisma/client';

function parseFeatures(features?: string): string[] {
  if (!features?.trim()) return [];
  return features
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean);
}

export async function createProperty(formData: FormData) {
  const raw = {
    title: formData.get('title') as string,
    city: formData.get('city') as string,
    neighborhood: (formData.get('neighborhood') as string) || undefined,
    addressLine: (formData.get('addressLine') as string) || undefined,
    areaText: formData.get('areaText') as string,
    propertyType: formData.get('propertyType') as PropertyType,
    bedrooms: formData.get('bedrooms') || undefined,
    bathrooms: formData.get('bathrooms') || undefined,
    sizeSqm: formData.get('sizeSqm') || undefined,
    lotSqm: formData.get('lotSqm') || undefined,
    price: formData.get('price') || undefined,
    currency: (formData.get('currency') as string) || 'USD',
    priceOnRequest: formData.get('priceOnRequest') === 'on',
    features: (formData.get('features') as string) || undefined,
    description: formData.get('description') as string,
    slug: (formData.get('slug') as string) || undefined,
    isFeatured: formData.get('isFeatured') === 'on',
    status: (formData.get('status') as string) || 'Draft',
    imageUrls: (formData.get('imageUrls') as string) || '[]',
  };

  const parsed = propertySchema.safeParse({
    ...raw,
    bedrooms: raw.bedrooms ? Number(raw.bedrooms) : null,
    bathrooms: raw.bathrooms ? Number(raw.bathrooms) : null,
    sizeSqm: raw.sizeSqm ? Number(raw.sizeSqm) : null,
    lotSqm: raw.lotSqm ? Number(raw.lotSqm) : null,
    price: raw.price ? Number(raw.price) : null,
  });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  let slug = data.slug?.trim() || slugify(data.title, data.city);
  const existing = await prisma.property.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const imageUrls: { url: string; alt: string; sortOrder: number }[] = [];
  try {
    const arr = JSON.parse(raw.imageUrls) as string[];
    arr.forEach((url, i) => {
      if (url?.trim()) imageUrls.push({ url: url.trim(), alt: data.title, sortOrder: i });
    });
  } catch {}

  if (imageUrls.length === 0) {
    return { error: { imageUrls: ['At least one image is required'] } };
  }

  await prisma.property.create({
    data: {
      slug,
      title: data.title,
      city: data.city,
      neighborhood: data.neighborhood,
      addressLine: data.addressLine,
      areaText: data.areaText,
      propertyType: data.propertyType,
      bedrooms: data.bedrooms ?? undefined,
      bathrooms: data.bathrooms ?? undefined,
      sizeSqm: data.sizeSqm ?? undefined,
      lotSqm: data.lotSqm ?? undefined,
      price: data.priceOnRequest ? null : (data.price ?? null),
      currency: data.currency,
      priceOnRequest: data.priceOnRequest,
      features: parseFeatures(data.features),
      description: data.description,
      status: (data.status as PropertyStatus) || PropertyStatus.Draft,
      isFeatured: data.isFeatured,
      images: {
        create: imageUrls,
      },
    },
  });

  revalidatePath('/');
  revalidatePath('/properties');
  revalidatePath('/admin/properties');
  redirect('/admin/properties');
}

export async function updateProperty(id: string, formData: FormData) {
  const raw = {
    title: formData.get('title') as string,
    city: formData.get('city') as string,
    neighborhood: (formData.get('neighborhood') as string) || undefined,
    addressLine: (formData.get('addressLine') as string) || undefined,
    areaText: formData.get('areaText') as string,
    propertyType: formData.get('propertyType') as PropertyType,
    bedrooms: formData.get('bedrooms') || undefined,
    bathrooms: formData.get('bathrooms') || undefined,
    sizeSqm: formData.get('sizeSqm') || undefined,
    lotSqm: formData.get('lotSqm') || undefined,
    price: formData.get('price') || undefined,
    currency: (formData.get('currency') as string) || 'USD',
    priceOnRequest: formData.get('priceOnRequest') === 'on',
    features: (formData.get('features') as string) || undefined,
    description: formData.get('description') as string,
    slug: (formData.get('slug') as string) || undefined,
    isFeatured: formData.get('isFeatured') === 'on',
    status: (formData.get('status') as string) || 'Draft',
    imageUrls: (formData.get('imageUrls') as string) || '[]',
  };

  const parsed = propertySchema.safeParse({
    ...raw,
    bedrooms: raw.bedrooms ? Number(raw.bedrooms) : null,
    bathrooms: raw.bathrooms ? Number(raw.bathrooms) : null,
    sizeSqm: raw.sizeSqm ? Number(raw.sizeSqm) : null,
    lotSqm: raw.lotSqm ? Number(raw.lotSqm) : null,
    price: raw.price ? Number(raw.price) : null,
  });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const slug = data.slug?.trim() || (await prisma.property.findUnique({ where: { id }, select: { slug: true } }))?.slug;
  if (!slug) return { error: { slug: ['Property not found'] } };

  const imageUrls: { url: string; alt: string; sortOrder: number }[] = [];
  try {
    const arr = JSON.parse(raw.imageUrls) as string[];
    arr.forEach((url, i) => {
      if (url?.trim()) imageUrls.push({ url: url.trim(), alt: data.title, sortOrder: i });
    });
  } catch {}

  if (imageUrls.length === 0) {
    return { error: { imageUrls: ['At least one image is required'] } };
  }

  await prisma.property.update({
    where: { id },
    data: {
      slug,
      title: data.title,
      city: data.city,
      neighborhood: data.neighborhood,
      addressLine: data.addressLine,
      areaText: data.areaText,
      propertyType: data.propertyType,
      bedrooms: data.bedrooms ?? undefined,
      bathrooms: data.bathrooms ?? undefined,
      sizeSqm: data.sizeSqm ?? undefined,
      lotSqm: data.lotSqm ?? undefined,
      price: data.priceOnRequest ? null : (data.price ?? null),
      currency: data.currency,
      priceOnRequest: data.priceOnRequest,
      features: parseFeatures(data.features),
      description: data.description,
      status: data.status as PropertyStatus,
      isFeatured: data.isFeatured,
    },
  });

  // Replace images
  await prisma.propertyImage.deleteMany({ where: { propertyId: id } });
  await prisma.propertyImage.createMany({
    data: imageUrls.map((img) => ({
      propertyId: id,
      url: img.url,
      alt: img.alt,
      sortOrder: img.sortOrder,
    })),
  });

  revalidatePath('/');
  revalidatePath('/properties');
  revalidatePath(`/properties/${slug}`);
  revalidatePath('/admin/properties');
  redirect('/admin/properties');
}
