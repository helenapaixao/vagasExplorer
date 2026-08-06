const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

/**
 * "há 2 dias" / "há 3 meses". Job age is the strongest freshness signal in
 * these repos, where closed positions often stay open as issues.
 */
export function formatRelativeDate(iso: string | null | undefined): string {
  if (!iso) return '';

  const timestamp = new Date(iso).getTime();
  if (Number.isNaN(timestamp)) return '';

  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

  if (seconds < MINUTE) return 'agora mesmo';
  if (seconds < HOUR) {
    const value = Math.floor(seconds / MINUTE);
    return `há ${value} ${value === 1 ? 'minuto' : 'minutos'}`;
  }
  if (seconds < DAY) {
    const value = Math.floor(seconds / HOUR);
    return `há ${value} ${value === 1 ? 'hora' : 'horas'}`;
  }
  if (seconds < MONTH) {
    const value = Math.floor(seconds / DAY);
    return `há ${value} ${value === 1 ? 'dia' : 'dias'}`;
  }
  if (seconds < YEAR) {
    const value = Math.floor(seconds / MONTH);
    return `há ${value} ${value === 1 ? 'mês' : 'meses'}`;
  }

  const value = Math.floor(seconds / YEAR);
  return `há ${value} ${value === 1 ? 'ano' : 'anos'}`;
}

/** Jobs older than this are very likely already filled. */
export function isStale(iso: string | null | undefined, days = 90): boolean {
  if (!iso) return false;
  const timestamp = new Date(iso).getTime();
  if (Number.isNaN(timestamp)) return false;
  return Date.now() - timestamp > days * DAY * 1000;
}

export function toIsoDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}
