import Link from 'next/link';
import { prisma } from '@/lib/db';
import { t } from '@/lib/i18n';
import { PropertyStatus } from '@prisma/client';
import { deleteProperty } from './actions';
import { DeletePropertyButton } from '@/components/admin/DeletePropertyButton';

export const dynamic = 'force-dynamic';

export default async function AdminPropertiesListPage() {
  const properties = await prisma.property.findMany({
    include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('admin.properties')}</h1>
        <Link
          href="/admin/properties/new"
          className="rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700"
        >
          {t('admin.addProperty')}
        </Link>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">City</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {properties.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{p.title}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{p.city}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{t(`propertyType.${p.propertyType}`)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === PropertyStatus.Published
                        ? 'bg-green-100 text-green-800'
                        : p.status === PropertyStatus.Sold
                          ? 'bg-slate-100 text-slate-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <Link href={`/properties/${p.slug}`} className="text-primary-600 hover:underline mr-3" target="_blank">
                    View
                  </Link>
                  <Link href={`/admin/properties/${p.id}/edit`} className="text-primary-600 hover:underline mr-3">
                    Edit
                  </Link>
                  <DeletePropertyButton
                    propertyId={p.id}
                    propertyTitle={p.title}
                    deleteAction={deleteProperty}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {properties.length === 0 && (
          <p className="px-4 py-8 text-center text-slate-500">No properties yet. Add your first one.</p>
        )}
      </div>
    </div>
  );
}
