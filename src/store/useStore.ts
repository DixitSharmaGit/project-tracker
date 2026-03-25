import { create } from 'zustand';
import type {
  Task,
  Status,
  ViewMode,
  SortState,
  FilterState,
  DragState,
  CollaboratorPresence,
} from '../types';
import { INITIAL_TASKS } from '../data/seed';

/* ---------------- FILTER HELPERS ---------------- */

function filtersToParams(f: FilterState): URLSearchParams {
  const p = new URLSearchParams();
  if (f.statuses.length) p.set('status', f.statuses.join(','));
  if (f.priorities.length) p.set('priority', f.priorities.join(','));
  if (f.assigneeIds.length) p.set('assignee', f.assigneeIds.join(','));
  if (f.dueDateFrom) p.set('from', f.dueDateFrom);
  if (f.dueDateTo) p.set('to', f.dueDateTo);
  return p;
}

function paramsToFilters(p: URLSearchParams): FilterState {
  return {
    statuses: (p.get('status')?.split(',') ?? []) as Status[],
    priorities: (p.get('priority')?.split(',') ?? []) as never[],
    assigneeIds: p.get('assignee')?.split(',') ?? [],
    dueDateFrom: p.get('from') ?? '',
    dueDateTo: p.get('to') ?? '',
  };
}

/* ---------------- TYPES ---------------- */

interface AppState {
  tasks: Task[];
  view: ViewMode;
  sort: SortState;
  filters: FilterState;
  drag: DragState;
  collaborators: CollaboratorPresence[];

  setView: (v: ViewMode) => void;
  setSort: (field: SortState['field']) => void;
  setFilter: (patch: Partial<FilterState>) => void;
  clearFilters: () => void;

  updateTaskStatus: (taskId: string, status: Status) => void;

  setDragState: (patch: Partial<DragState>) => void;
  clearDrag: () => void;

  setCollaborators: (c: CollaboratorPresence[]) => void;
}

/* ---------------- DEFAULTS ---------------- */

const DEFAULT_FILTERS: FilterState = {
  statuses: [],
  priorities: [],
  assigneeIds: [],
  dueDateFrom: '',
  dueDateTo: '',
};

const initialFilters = paramsToFilters(
  new URLSearchParams(window.location.search)
);

/* ---------------- STORE ---------------- */

export const useStore = create<AppState>((set) => ({
  tasks: INITIAL_TASKS,
  view: 'kanban',
  sort: { field: 'dueDate', direction: 'asc' },
  filters: initialFilters,

  /* 🔥 UPDATED DRAG STATE */
  drag: {
    draggingTaskId: null,
    sourceColumn: null,
    overColumn: null,
    pointerOffset: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    placeholderHeight: 0,
  },

  collaborators: [],

  /* ---------------- VIEW ---------------- */

  setView: (view) => set({ view }),

  /* ---------------- SORT ---------------- */

  setSort: (field) =>
    set((s) => ({
      sort: {
        field,
        direction:
          s.sort.field === field && s.sort.direction === 'asc'
            ? 'desc'
            : 'asc',
      },
    })),

  /* ---------------- FILTER ---------------- */

  setFilter: (patch) =>
    set((s) => {
      const next = { ...s.filters, ...patch };
      const params = filtersToParams(next);
      const newUrl = params.toString()
        ? `${window.location.pathname}?${params}`
        : window.location.pathname;

      window.history.pushState({}, '', newUrl);

      return { filters: next };
    }),

  clearFilters: () => {
    window.history.pushState({}, '', window.location.pathname);
    set({ filters: DEFAULT_FILTERS });
  },

  /* ---------------- TASK UPDATE ---------------- */

  updateTaskStatus: (taskId, status) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, status } : t
      ),
    })),

  /* ---------------- DRAG (IMPORTANT) ---------------- */

  setDragState: (patch) =>
    set((s) => ({
      drag: {
        ...s.drag,
        ...patch,
      },
    })),

  clearDrag: () =>
    set({
      drag: {
        draggingTaskId: null,
        sourceColumn: null,
        overColumn: null,
        pointerOffset: { x: 0, y: 0 },
        position: { x: 0, y: 0 },
        placeholderHeight: 0,
      },
    }),

  /* ---------------- COLLAB ---------------- */

  setCollaborators: (collaborators) => set({ collaborators }),
}));

/* ---------------- URL BACK SUPPORT ---------------- */

window.addEventListener('popstate', () => {
  const filters = paramsToFilters(
    new URLSearchParams(window.location.search)
  );
  useStore.setState({ filters });
});

/* ---------------- UTIL ---------------- */

export function hasActiveFilters(f: FilterState): boolean {
  return (
    f.statuses.length > 0 ||
    f.priorities.length > 0 ||
    f.assigneeIds.length > 0 ||
    !!f.dueDateFrom ||
    !!f.dueDateTo
  );
}