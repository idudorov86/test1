export function excelDateToMoscowString(value: any): string | null {
  if (!value) return null;
  let date: Date;
  if (typeof value === 'number') {
    date = new Date((value - 25569) * 86400 * 1000);
  } else if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'string') {
    const match = value.trim().match(/^(\d{1,2})[.\/](\d{1,2})[.\/](\d{2,4})$/);
    if (match) {
      const day = match[1].padStart(2, '0');
      const month = match[2].padStart(2, '0');
      const year = match[3].length === 2 ? '20' + match[3] : match[3];
      return `${year}-${month}-${day}`;
    }
    if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return value.trim().substring(0, 10);
    }
    date = new Date(value);
    if (isNaN(date.getTime())) return null;
  } else {
    return null;
  }
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

export function formatDateShort(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}.${parts[1]}`;
}

export function formatDateFull(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}
