export type ValueMode = 'THB' | 'PCT';

interface FormatOptions {
  mode?: ValueMode;
  currency?: string; // ISO code
  fractionDigits?: number;
  pctFractionDigits?: number;
  locale?: string;
}

const DEFAULTS: Required<Omit<FormatOptions,'mode'>> = {
  currency: 'THB',
  fractionDigits: 2,
  pctFractionDigits: 1,
  locale: 'th-TH'
};

export function formatValue(value: number, mode: ValueMode = 'THB', opts: FormatOptions = {}): string {
  const { currency, fractionDigits, pctFractionDigits, locale } = { ...DEFAULTS, ...opts };
  if (mode === 'PCT') {
    return `${(value*100).toFixed(pctFractionDigits)}%`;
  }
  return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(value);
}

export function parseNumber(input: unknown): number {
  if (input == null) return 0;
  const n = typeof input === 'number' ? input : Number(input);
  return isNaN(n) ? 0 : n;
}
