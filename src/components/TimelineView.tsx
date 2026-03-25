import { useMemo, useRef } from 'react';
import { useStore } from '../store/useStore';
import { PRIORITY_BAR_COLORS } from '../utils/colors';
import { getMonthDays, today } from '../utils/date';
import { USERS } from '../data/seed';

const DAY_WIDTH  = 36;
const ROW_HEIGHT = 44;
const LABEL_WIDTH = 200;

export function TimelineView() {
  const tasks   = useStore((s) => s.tasks);
  const filters = useStore((s) => s.filters);
  const scrollRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const days = getMonthDays(now.getFullYear(), now.getMonth());
  const todayStr = today();

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

  const monthTasks = useMemo(() => {
    const firstDay = days[0];
    const lastDay  = days[days.length - 1];
    return filtered.filter((t) => {
      const start = t.startDate ?? t.dueDate;
      return start <= lastDay && t.dueDate >= firstDay;
    }).slice(0, 80);
  }, [filtered, days]);

  const todayIndex = days.indexOf(todayStr);

  function getBarStyle(task: { startDate: string | null; dueDate: string }) {
    const firstDay  = days[0];
    const lastDay   = days[days.length - 1];
    const startDate = task.startDate ?? task.dueDate;

    const clampedStart = startDate < firstDay ? firstDay : startDate;
    const clampedEnd   = task.dueDate > lastDay ? lastDay : task.dueDate;

    const startIdx = days.indexOf(clampedStart);
    const endIdx   = days.indexOf(clampedEnd);

    if (startIdx === -1 && endIdx === -1) return null;

    const s = startIdx === -1 ? 0 : startIdx;
    const e = endIdx   === -1 ? days.length - 1 : endIdx;

    return {
      left: s * DAY_WIDTH,
      width: Math.max(DAY_WIDTH, (e - s + 1) * DAY_WIDTH),
    };
  }

  if (monthTasks.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <span className="text-4xl">📅</span>
        <p className="text-[#6b6b8a] text-sm">No tasks in current month</p>
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

      {/* Month label */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm font-semibold text-[#e2e2f0]">
          {now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </span>
        <span className="text-xs text-[#6b6b8a]">
          — {monthTasks.length} tasks
        </span>
      </div>

      <div className="flex-1 bg-[#111118] border border-[#1a1a24]
        rounded-xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex flex-shrink-0 border-b border-[#1a1a24]
          bg-[#0a0a0f] sticky top-0 z-10">

          <div
            className="flex-shrink-0 border-r border-[#1a1a24] px-4 py-2 flex items-center"
            style={{ width: LABEL_WIDTH }}
          >
            <span className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider">
              Task
            </span>
          </div>

          <div ref={scrollRef} className="overflow-x-auto flex-1">
            <div className="flex relative" style={{ width: days.length * DAY_WIDTH }}>
              
              {/* 🔥 FIX: removed unused 'i' */}
              {days.map((day) => {
                const isToday = day === todayStr;
                const d = new Date(day + 'T00:00:00');
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;

                return (
                  <div
                    key={day}
                    className={`flex-shrink-0 flex flex-col items-center
                      justify-center py-2 border-r border-[#1a1a24]
                      ${isToday ? 'bg-[#4f8ef7]/10' : ''}
                      ${isWeekend ? 'bg-[#ffffff04]' : ''}`}
                    style={{ width: DAY_WIDTH }}
                  >
                    <span className={`text-[9px] font-bold ${
                      isToday ? 'text-[#4f8ef7]' : 'text-[#3a3a52]'
                    }`}>
                      {d.toLocaleDateString('en-IN', { weekday: 'narrow' })}
                    </span>
                    <span className={`text-[10px] font-semibold ${
                      isToday ? 'text-[#4f8ef7]' : 'text-[#6b6b8a]'
                    }`}>
                      {d.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {monthTasks.map((task) => {
            const assignee = USERS.find((u) => u.id === task.assigneeId);
            const barStyle = getBarStyle(task);
            const barColor = PRIORITY_BAR_COLORS[task.priority];
            const isSingleDay = !task.startDate;

            return (
              <div
                key={task.id}
                className="flex border-b border-[#1a1a24]"
                style={{ height: ROW_HEIGHT }}
              >
                <div
                  className="flex-shrink-0 border-r border-[#1a1a24] px-3 flex items-center gap-2"
                  style={{ width: LABEL_WIDTH }}
                >
                  {assignee && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{
                        backgroundColor: assignee.color + '33',
                        color: assignee.color,
                      }}
                    >
                      {assignee.initials}
                    </div>
                  )}
                  <span className="text-xs text-[#e2e2f0] truncate">
                    {task.title}
                  </span>
                </div>

                <div className="flex-1 relative">
                  <div className="relative h-full" style={{ width: days.length * DAY_WIDTH }}>

                    {/* Today line */}
                    {todayIndex >= 0 && (
                      <div
                        className="absolute top-0 bottom-0 w-px bg-[#4f8ef7]/60"
                        style={{ left: todayIndex * DAY_WIDTH + DAY_WIDTH / 2 }}
                      />
                    )}

                    {/* Task bar */}
                    {barStyle && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 rounded-md px-2"
                        style={{
                          left: barStyle.left + 2,
                          width: barStyle.width - 4,
                          height: ROW_HEIGHT * 0.55,
                          backgroundColor: barColor + '33',
                          borderLeft: `3px solid ${barColor}`,
                        }}
                      >
                        {!isSingleDay && (
                          <span className="text-[9px]" style={{ color: barColor }}>
                            {task.title}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}