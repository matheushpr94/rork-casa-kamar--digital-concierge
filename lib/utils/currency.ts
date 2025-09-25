export function formatCurrencyBRL(n?: number | null): string {
  if (n == null || Number.isNaN(n)) return '';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}