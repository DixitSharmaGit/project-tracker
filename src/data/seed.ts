import type { Task, User, Priority, Status } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Arjun Mehta',  initials: 'AM', color: '#4f8ef7' },
  { id: 'u2', name: 'Priya Sharma', initials: 'PS', color: '#9b6dff' },
  { id: 'u3', name: 'Rohit Verma',  initials: 'RV', color: '#00e5a0' },
  { id: 'u4', name: 'Sneha Iyer',   initials: 'SI', color: '#ffb547' },
  { id: 'u5', name: 'Dev Kapoor',   initials: 'DK', color: '#00d4ff' },
  { id: 'u6', name: 'Meera Nair',   initials: 'MN', color: '#ff4d6d' },
];

export const COLLABORATORS: User[] = [
  USERS[1],
  USERS[3],
  USERS[4],
  USERS[5],
];

const PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low'];
const STATUSES: Status[]     = ['To Do', 'In Progress', 'In Review', 'Done'];

const TITLE_VERBS = [
  'Implement', 'Refactor', 'Fix', 'Design', 'Review', 'Update',
  'Migrate', 'Optimize', 'Add', 'Remove', 'Test', 'Document',
  'Deploy', 'Integrate', 'Audit', 'Configure', 'Build', 'Analyse',
];

const TITLE_NOUNS = [
  'authentication flow', 'dashboard layout', 'API endpoints', 'user onboarding',
  'database schema', 'CI/CD pipeline', 'error handling', 'search functionality',
  'notification system', 'payment gateway', 'admin panel', 'reporting module',
  'export feature', 'dark mode', 'mobile navigation', 'data visualisation',
  'caching layer', 'file uploads', 'email templates', 'access controls',
  'audit logs', 'rate limiting', 'webhook integration', 'SSO setup',
  'performance profiling', 'unit tests', 'end-to-end tests', 'API docs',
  'UI components', 'state management', 'WebSocket server', 'CDN setup',
  'Lighthouse fixes', 'accessibility audit', 'i18n support', 'feature flags',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateTasks(count = 500): Task[] {
  const today = new Date();
  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const id       = `task-${i + 1}`;
    const title    = `${randomItem(TITLE_VERBS)} ${randomItem(TITLE_NOUNS)}`;
    const status   = randomItem(STATUSES);
    const priority = randomItem(PRIORITIES);
    const assigneeId = randomItem(USERS).id;

    const dueDaysOffset = randomInt(-20, 30);
    const dueDate = toISO(addDays(today, dueDaysOffset));

    const hasStartDate = Math.random() > 0.2;
    let startDate: string | null = null;
    if (hasStartDate) {
      const startDaysOffset = dueDaysOffset - randomInt(1, 14);
      startDate = toISO(addDays(today, startDaysOffset));
    }

    tasks.push({ id, title, status, priority, assigneeId, startDate, dueDate });
  }

  return tasks;
}

export const INITIAL_TASKS = generateTasks(500);