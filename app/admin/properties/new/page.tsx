import { t } from '@/lib/i18n';
import { PropertyForm } from '@/components/admin/PropertyForm';
import { createProperty } from '../actions';

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">{t('admin.newProperty')}</h1>
      <PropertyForm action={createProperty} submitLabel={t('admin.publish')} />
    </div>
  );
}
