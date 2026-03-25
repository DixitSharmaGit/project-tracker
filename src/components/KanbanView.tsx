import { useMemo, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { KanbanColumn } from './KanbanColumn';
import { STATUSES } from '../utils/colors';
import type { Status } from '../types';

export function KanbanView() {
  const tasks = useStore((s) => s.tasks);
  const filters = useStore((s) => s.filters);

  const drag = useStore((s) => s.drag);
  const setDragState = useStore((s) => s.setDragState);
  const clearDrag = useStore((s) => s.clearDrag);
  const updateTaskStatus = useStore((s) => s.updateTaskStatus);

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredTasks = useMemo(() => {
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

  const tasksByStatus = (status: Status) =>
    filteredTasks.filter((t) => t.status === status);

  /* ---------------- DRAG SYSTEM ---------------- */
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!drag.draggingTaskId) return;

      setDragState({
        position: { x: e.clientX, y: e.clientY },
      });
    };

    const handlePointerUp = () => {
      /* 🔥 FIX: Only update if valid + different column */
      if (
        drag.draggingTaskId &&
        drag.overColumn &&
        drag.sourceColumn !== drag.overColumn
      ) {
        updateTaskStatus(drag.draggingTaskId, drag.overColumn);
      }

      clearDrag();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [drag, setDragState, clearDrag, updateTaskStatus]);

  /* ---------------- DRAGGED TASK ---------------- */
  const draggedTask = tasks.find(
    (t) => t.id === drag.draggingTaskId
  );

  return (
    <div className="h-full overflow-x-auto overflow-y-hidden px-6 py-4 relative">
      
      {/* COLUMNS */}
      <div className="flex gap-4 h-full min-w-max">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus(status)}
          />
        ))}
      </div>

      {/* 🔥 DRAG PREVIEW */}
      {draggedTask && (
        <div
          style={{
            position: 'fixed',
            top: drag.position.y - drag.pointerOffset.y,
            left: drag.position.x - drag.pointerOffset.x,
            pointerEvents: 'none',
            zIndex: 999,
            opacity: 0.9,
          }}
          className="bg-[#1a1a24] border border-[#2c2c3d] rounded-lg p-3 shadow-2xl w-56"
        >
          {draggedTask.title}
        </div>
      )}
    </div>
  );
}