export function today(): string {
  return new Date().toISOString().split('T')[0];
}

export function daysDiff(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - now.getTime()) / 86_400_000);
}

export function dueDateLabel(dueDate: string): {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
} {
  const diff = daysDiff(dueDate);
  const isToday   = diff === 0;
  const isOverdue = diff < 0;

  if (isToday)    return { label: 'Due Today', isOverdue: false, isToday: true };
  if (diff < -7)  return { label: `${Math.abs(diff)}d overdue`, isOverdue: true, isToday: false };
  if (isOverdue)  return { label: formatDate(dueDate), isOverdue: true, isToday: false };
  return { label: formatDate(dueDate), isOverdue: false, isToday: false };
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function getMonthDays(year: number, month: number): string[] {
  const days: string[] = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(d.toISOString().split('T')[0]);
    d.setDate(d.getDate() + 1);
  }
  return days;
}