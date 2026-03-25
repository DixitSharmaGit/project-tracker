export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type Status = 'To Do' | 'In Progress' | 'In Review' | 'Done';

/* ---------------- USER ---------------- */
export interface User {
  id: string;
  name: string;
  color: string;
  initials: string;
}

/* ---------------- TASK ---------------- */
export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assigneeId: string;
  startDate: string | null;
  dueDate: string;
  description?: string;
}

/* ---------------- VIEW ---------------- */
export type ViewMode = 'kanban' | 'list' | 'timeline';

/* ---------------- SORT ---------------- */
export type SortField = 'title' | 'priority' | 'dueDate';

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

/* ---------------- FILTER ---------------- */
export interface FilterState {
  statuses: Status[];
  priorities: Priority[];
  assigneeIds: string[];
  dueDateFrom: string;
  dueDateTo: string;
}

/* ---------------- DRAG ---------------- */
export interface DragState {
  draggingTaskId: string | null;
  sourceColumn: Status | null;
  overColumn: Status | null;
  placeholderHeight: number;

  // 🔥 REQUIRED FOR CUSTOM DRAG
  pointerOffset: {
    x: number;
    y: number;
  };

  position: {
    x: number;
    y: number;
  };
}

/* ---------------- COLLABORATION ---------------- */
export interface CollaboratorPresence {
  userId: string;
  taskId: string | null;
  action: 'viewing' | 'editing';
}