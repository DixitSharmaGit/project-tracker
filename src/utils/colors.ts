import type { Priority, Status } from '../types';

export const PRIORITY_COLORS: Record<Priority, string> = {
  Critical: 'bg-red-500/20 text-red-400 border border-red-500/30',
  High:     'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  Medium:   'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Low:      'bg-blue-500/20 text-blue-400 border border-blue-500/30',
};

export const PRIORITY_BAR_COLORS: Record<Priority, string> = {
  Critical: '#ff4d6d',
  High:     '#ff7d4d',
  Medium:   '#ffb547',
  Low:      '#4f8ef7',
};

export const PRIORITY_ORDER: Record<Priority, number> = {
  Critical: 0,
  High:     1,
  Medium:   2,
  Low:      3,
};

export const STATUS_COLORS: Record<Status, string> = {
  'To Do':       'text-slate-400',
  'In Progress': 'text-blue-400',
  'In Review':   'text-purple-400',
  'Done':        'text-green-400',
};

export const STATUSES: Status[] = [
  'To Do',
  'In Progress',
  'In Review',
  'Done',
];

export const PRIORITIES: Priority[] = [
  'Critical',
  'High',
  'Medium',
  'Low',
];