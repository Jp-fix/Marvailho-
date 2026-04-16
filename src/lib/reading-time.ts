import readingTime from 'reading-time';

export function formatReadingTime(body: string): string {
  const { minutes } = readingTime(body, { wordsPerMinute: 220 });
  const mins = Math.max(1, Math.round(minutes));
  return `${mins} min de lecture`;
}
