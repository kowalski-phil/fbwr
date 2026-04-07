export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function today(): string {
  return formatDate(new Date());
}
