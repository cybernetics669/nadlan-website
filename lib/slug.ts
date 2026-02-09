export function slugify(title: string, city: string): string {
  const base = `${title} ${city}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
  return base || `property-${Date.now()}`;
}
