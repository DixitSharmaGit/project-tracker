import { useRef } from 'react';
import type { Task, Status } from '../types';
import { TaskCard } from './TaskCard';
import { useStore } from '../store/useStore';

interface Props {
  status: Status;
  tasks: Task[];
}

const COLUMN_COLORS: Record<Status, string> = {
  'To Do':       'border-t-slate-500',
  'In Progress': 'border-t-blue-500',
  'In Review':   'border-t-purple-500',
  'Done':        'border-t-green-500',
};

const COLUMN_DOT: Record<Status, string> = {
  'To Do':       'bg-slate-400',
  'In Progress': 'bg-blue-400',
  'In Review':   'bg-purple-400',
  'Done':        'bg-green-400',
};

export function KanbanColumn({ status, tasks }: Props) {
  const drag = useStore((s) => s.drag);
  const setDragState = useStore((s) => s.setDragState);

  const columnRef = useRef<HTMLDivElement>(null);

  const isOver = drag.overColumn === status;

  /* 🔥 POINTER ENTER = SET DROP TARGET */
  const handlePointerEnter = () => {
    if (drag.draggingTaskId) {
      setDragState({ overColumn: status });
    }
  };

  return (
    <div
      ref={columnRef}
      onPointerEnter={handlePointerEnter}
      className={`flex flex-col w-72 flex-shrink-0 rounded-xl border-t-2
        bg-[#111118] border border-[#1a1a24] transition-all duration-150
        ${COLUMN_COLORS[status]}
        ${isOver ? 'border-[#4f8ef7]/40 bg-[#4f8ef7]/5' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3
        border-b border-[#1a1a24] flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${COLUMN_DOT[status]}`} />
          <span className="text-xs font-semibold text-[#e2e2f0] uppercase tracking-wider">
            {status}
          </span>
        </div>
        <span className="text-xs font-mono text-[#6b6b8a] bg-[#1a1a24]
          px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-0">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32
            border border-dashed border-[#2c2c3d] rounded-lg">
            <span className="text-2xl mb-1">📭</span>
            <span className="text-xs text-[#6b6b8a]">No tasks here</span>
            <span className="text-[10px] text-[#3a3a52] mt-0.5">
              Drop a card to add
            </span>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id}>
              {/* Placeholder */}
              {drag.draggingTaskId === task.id ? (
                <TaskCard task={task} isPlaceholder />
              ) : (
                <TaskCard
                  task={task}
                  isDragging={drag.draggingTaskId === task.id}
                />
              )}
            </div>
          ))
        )}

        {/* Drop indicator */}
        {isOver && drag.draggingTaskId && drag.sourceColumn !== status && (
          <div className="h-1 rounded-full bg-[#4f8ef7]/40 mx-2 mt-1" />
        )}
      </div>
    </div>
  );
}