import type { Service } from '@/lib/ports/services.port';

export function getMinVariantPrice(s: Service): number | null {
  if (!s?.variants?.length) return s?.price ?? null;
  const prices = s.variants.map(v => v?.price).filter((p): p is number => typeof p === 'number');
  if (!prices.length) return s?.price ?? null;
  return Math.min(...prices);
}