import { getCollection, type CollectionEntry } from 'astro:content';

export type Story = CollectionEntry<'stories'>;

export async function getPublishedStories(): Promise<Story[]> {
  const all = await getCollection('stories', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  return all.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

export function formatDate(date: Date, locale = 'fr-FR'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

const UNITS_FR = [
  'zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
  'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
  'dix-sept', 'dix-huit', 'dix-neuf',
];

const TENS_FR: Record<number, string> = {
  2: 'vingt',
  3: 'trente',
  4: 'quarante',
  5: 'cinquante',
  6: 'soixante',
  8: 'quatre-vingt',
};

function belowHundredFr(n: number): string {
  if (n < 20) return UNITS_FR[n];
  if (n < 60) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    if (u === 0) return TENS_FR[t];
    if (u === 1) return `${TENS_FR[t]} et un`;
    return `${TENS_FR[t]}-${UNITS_FR[u]}`;
  }
  if (n < 80) {
    const u = n - 60;
    if (u === 0) return 'soixante';
    if (u === 1) return 'soixante et un';
    if (u === 11) return 'soixante et onze';
    return `soixante-${UNITS_FR[u]}`;
  }
  // 80-99
  const u = n - 80;
  if (u === 0) return 'quatre-vingts';
  return `quatre-vingt-${UNITS_FR[u]}`;
}

function dayToFr(day: number): string {
  if (day === 1) return 'premier';
  return belowHundredFr(day);
}

function yearToFr(year: number): string {
  if (year >= 2000 && year < 2100) {
    const rem = year - 2000;
    if (rem === 0) return 'deux mille';
    return `deux mille ${belowHundredFr(rem)}`;
  }
  if (year >= 1000 && year < 2000) {
    const rem = year - 1000;
    if (rem === 0) return 'mille';
    if (rem < 100) return `mille ${belowHundredFr(rem)}`;
  }
  return String(year);
}

const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

export function formatDateLong(date: Date): string {
  const d = date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear();
  return `${dayToFr(d)} ${MONTHS_FR[m]} ${yearToFr(y)}`;
}
