import Link from 'next/link';
import { prisma } from '@/lib/db';
import { t } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [propertyCount, publishedCount, leadCount] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: 'Published' } }),
    prisma.lead.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{t('admin.dashboard')}</h1>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total properties</p>
          <p className="text-2xl font-semibold text-slate-900">{propertyCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Published</p>
          <p className="text-2xl font-semibold text-slate-900">{publishedCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Inquiries (leads)</p>
          <p className="text-2xl font-semibold text-slate-900">{leadCount}</p>
        </div>
      </div>
      <div className="mt-8">
        <Link
          href="/admin/properties/new"
          className="inline-flex rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700"
        >
          {t('admin.addProperty')}
        </Link>
        <Link
          href="/admin/properties"
          className="ml-4 inline-flex rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          {t('admin.properties')}
        </Link>
      </div>
    </div>
  );
}
