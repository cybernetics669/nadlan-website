'use client';

import { useTransition } from 'react';
import { t } from '@/lib/i18n';

type Props = {
  propertyId: string;
  propertyTitle: string;
  deleteAction: (id: string) => Promise<void>;
};

export function DeletePropertyButton({ propertyId, propertyTitle, deleteAction }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(t('admin.deletePropertyConfirm'))) return;
    startTransition(() => deleteAction(propertyId));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-red-600 hover:text-red-800 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
      title={propertyTitle}
    >
      {isPending ? '...' : t('admin.deleteProperty')}
    </button>
  );
}
