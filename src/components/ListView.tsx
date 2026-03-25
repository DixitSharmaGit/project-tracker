import { useMemo, useRef, useState, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { USERS } from '../data/seed';
import { PRIORITY_COLORS, PRIORITY_ORDER, STATUSES } from '../utils/colors';
import { dueDateLabel } from '../utils/date';
import type { Task, SortField, Status } from '../types';

const ROW_HEIGHT = 56;
const BUFFER     = 5;

function sortTasks(tasks: Task[], field: SortField, dir: 'asc' | 'desc'): Task[] {
  return [...tasks].sort((a, b) => {
    let cmp = 0;
    if (field === 'title')    cmp = a.title.localeCompare(b.title);
    if (field === 'priority') cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (field === 'dueDate')  cmp = a.dueDate.localeCompare(b.dueDate);
    return dir === 'asc' ? cmp : -cmp;
  });
}

export function ListView() {
  const tasks      = useStore((s) => s.tasks);
  const filters    = useStore((s) => s.filters);
  const sort       = useStore((s) => s.sort);
  const setSort    = useStore((s) => s.setSort);
  const updateTaskStatus = useStore((s) => s.updateTaskStatus);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Filter
  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.statuses.length &&
          !filters.statuses.includes(t.status)) return false;
      if (filters.priorities.length &&
          !filters.priorities.includes(t.priority)) return false;
      if (filters.assigneeIds.length &&
          !filters.assigneeIds.includes(t.assigneeId)) return false;
      if (filters.dueDateFrom && t.dueDate < filters.dueDateFrom) return false;
      if (filters.dueDateTo   && t.dueDate > filters.dueDateTo)   return false;
      return true;
    });
  }, [tasks, filters]);

  // Sort
  const sorted = useMemo(
    () => sortTasks(filtered, sort.field, sort.direction),
    [filtered, sort]
  );

  // Virtual scroll calculation
  const containerHeight = 600;
  const totalHeight     = sorted.length * ROW_HEIGHT;
  const visibleCount    = Math.ceil(containerHeight / ROW_HEIGHT);
  const startIndex      = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex        = Math.min(sorted.length, startIndex + visibleCount + BUFFER * 2);
  const visibleTasks    = sorted.slice(startIndex, endIndex);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  function SortIcon({ field }: { field: SortField }) {
    if (sort.field !== field) return <span className="text-[#3a3a52] ml-1">↕</span>;
    return (
      <span className="text-[#4f8ef7] ml-1">
        {sort.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  }

  // Empty state
  if (sorted.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <span className="text-4xl">🔍</span>
        <p className="text-[#6b6b8a] text-sm">No tasks match your filters</p>
        <button
          onClick={() => useStore.getState().clearFilters()}
          className="text-xs text-[#4f8ef7] border border-[#4f8ef7]/30
            px-4 py-1.5 rounded-md hover:bg-[#4f8ef7]/10 transition-colors"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col px-6 py-4">

      {/* Task count */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs text-[#6b6b8a]">
          Showing <span className="text-[#e2e2f0] font-semibold">{sorted.length}</span> tasks
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 bg-[#111118] border border-[#1a1a24] rounded-xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3
          border-b border-[#1a1a24] bg-[#0a0a0f] flex-shrink-0">
          {(
            [
              { label: 'Title',    field: 'title'    },
              { label: 'Priority', field: 'priority' },
              { label: 'Due Date', field: 'dueDate'  },
            ] as { label: string; field: SortField }[]
          ).map(({ label, field }) => (
            <button
              key={field}
              onClick={() => setSort(field)}
              className={`text-left text-xs font-semibold uppercase tracking-wider
                transition-colors flex items-center
                ${sort.field === field
                  ? 'text-[#4f8ef7]'
                  : 'text-[#6b6b8a] hover:text-[#e2e2f0]'
                }`}
            >
              {label}
              <SortIcon field={field} />
            </button>
          ))}
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6b6b8a]">
            Assignee
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6b6b8a]">
            Status
          </span>
        </div>

        {/* Virtual scroll container */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto relative"
          style={{ height: `${containerHeight}px` }}
        >
          {/* Total height spacer */}
          <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
            {visibleTasks.map((task, i) => {
              const actualIndex = startIndex + i;
              const assignee    = USERS.find((u) => u.id === task.assigneeId);
              const { label, isOverdue, isToday } = dueDateLabel(task.dueDate);

              return (
                <div
                  key={task.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-4
                    border-b border-[#1a1a24] hover:bg-[#1a1a24]/50
                    transition-colors duration-100 items-center absolute w-full"
                  style={{
                    top:    `${actualIndex * ROW_HEIGHT}px`,
                    height: `${ROW_HEIGHT}px`,
                  }}
                >
                  {/* Title */}
                  <span className="text-xs text-[#e2e2f0] truncate font-medium">
                    {task.title}
                  </span>

                  {/* Priority */}
                  <span className={`text-[10px] font-semibold px-2 py-0.5
                    rounded-full w-fit ${PRIORITY_COLORS[task.priority]}`}>
                    {task.priority}
                  </span>

                  {/* Due date */}
                  <span className={`text-xs font-medium ${
                    isToday   ? 'text-[#ffb547]' :
                    isOverdue ? 'text-[#ff4d6d]' :
                                'text-[#6b6b8a]'
                  }`}>
                    {label}
                  </span>

                  {/* Assignee */}
                  {assignee && (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center
                          justify-center text-[10px] font-bold flex-shrink-0"
                        style={{
                          backgroundColor: assignee.color + '33',
                          color: assignee.color,
                        }}
                      >
                        {assignee.initials}
                      </div>
                      <span className="text-xs text-[#6b6b8a] truncate">
                        {assignee.name}
                      </span>
                    </div>
                  )}

                  {/* Status dropdown */}
                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateTaskStatus(task.id, e.target.value as Status)
                    }
                    className="bg-[#1a1a24] border border-[#2c2c3d] text-xs
                      text-[#e2e2f0] rounded-md px-2 py-1 outline-none
                      focus:border-[#4f8ef7] cursor-pointer w-full"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}