'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div
      id="toast"
      role="status"
      aria-live="polite"
      className="show flex items-center gap-2.5 shadow-xl"
    >
      {toast.type === 'error' ? (
        <AlertCircle className="w-4 h-4 text-[#FF8A80]" />
      ) : toast.type === 'info' ? (
        <Info className="w-4 h-4 text-[#8DBCF2]" />
      ) : (
        <CheckCircle2 className="w-4 h-4 text-[#6FE0B8]" />
      )}
      <span>{toast.message}</span>
    </div>
  );
}
