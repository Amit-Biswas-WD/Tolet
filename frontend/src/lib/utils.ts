import { Language } from '@/types';

export function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function formatNumber(num: number | string, lang: Language = 'bn'): string {
  const n = Number(num);
  if (isNaN(n)) return String(num);
  return n.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US');
}

export function formatCurrency(amount: number | string, lang: Language = 'bn'): string {
  return `৳ ${formatNumber(amount, lang)}`;
}

export function formatDate(isoDate: string, lang: Language = 'bn'): string {
  if (!isoDate || isoDate === 'now') {
    return lang === 'bn' ? 'এখনই খালি' : 'Available now';
  }
  try {
    const d = new Date(isoDate + (isoDate.includes('T') ? '' : 'T00:00:00'));
    return d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

export function pickLang<T>(pair: [T, T] | undefined, lang: Language): T {
  if (!pair) return '' as unknown as T;
  return lang === 'bn' ? pair[0] : pair[1];
}
