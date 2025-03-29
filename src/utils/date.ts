export function formatDate(date: Date): string {
  return (
    date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0')
  );
}

export function parseDate(dateString: string): Date {
  const match: RegExpMatchArray | null = dateString.match(
    /(\d{4})(\d{2})(\d{2})/,
  );

  if (!match) {
    throw new Error('Format de date invalide. Attendu: YYYYMMDD');
  }

  const year: number = Number(match[1]);
  const month: number = Number(match[2]) - 1; // Mois commence à 0 en JS
  const day: number = Number(match[3]);

  return new Date(year, month, day);
}
