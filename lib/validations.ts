import { z } from 'zod';
import { PropertyType } from '@prisma/client';

export const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  city: z.string().min(1, 'City is required'),
  neighborhood: z.string().optional(),
  addressLine: z.string().optional(),
  areaText: z.string().min(1, 'Area description is required'),
  propertyType: z.nativeEnum(PropertyType),
  bedrooms: z.coerce.number().int().min(0).optional().nullable(),
  bathrooms: z.coerce.number().int().min(0).optional().nullable(),
  sizeSqm: z.coerce.number().int().min(0).optional().nullable(),
  lotSqm: z.coerce.number().int().min(0).optional().nullable(),
  price: z.coerce.number().min(0).optional().nullable(),
  currency: z.string().default('USD'),
  priceOnRequest: z.boolean().default(false),
  features: z.string().optional(), // comma-separated, we split in action
  description: z.string().min(1, 'Description is required'),
  slug: z.string().optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(['Draft', 'Published', 'Sold']).optional(),
});

export const leadSchema = z.object({
  propertyId: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
export type LeadFormData = z.infer<typeof leadSchema>;
