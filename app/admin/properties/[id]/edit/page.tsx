import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { t } from '@/lib/i18n';
import { PropertyForm } from '@/components/admin/PropertyForm';
import { updateProperty } from '../../actions';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function EditPropertyPage({ params }: Props) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!property) notFound();

  const updateWithId = updateProperty.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t('admin.editProperty')}: {property.title}</h1>
        <Link href="/admin/properties" className="text-primary-600 hover:underline text-sm">
          ← Back to list
        </Link>
      </div>
      <PropertyForm action={updateWithId} property={property} submitLabel={t('admin.publish')} />
    </div>
  );
}
