export function DateFormatter(date) {
  if (!(date instanceof Date)) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}