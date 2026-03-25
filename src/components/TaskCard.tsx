import type { Task } from '../types';
import { USERS } from '../data/seed';
import { PRIORITY_COLORS } from '../utils/colors';
import { dueDateLabel } from '../utils/date';
import { useStore } from '../store/useStore';

interface Props {
  task: Task;
  isDragging?: boolean;
  isPlaceholder?: boolean;
}

export function TaskCard({ task, isDragging, isPlaceholder }: Props) {
  const { setDragState } = useStore();

  const collaborators = useStore((s) => s.collaborators);
  const assignee = USERS.find((u) => u.id === task.assigneeId);
  const { label, isOverdue, isToday } = dueDateLabel(task.dueDate);

  // Find collaborators on this task
  const activeCollabs = collaborators.filter((c) => c.taskId === task.id);
  const collabUsers = activeCollabs
    .map((c) => USERS.find((u) => u.id === c.userId))
    .filter(Boolean);

  /* 🔥 NEW DRAG START */
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setDragState({
      draggingTaskId: task.id,
      sourceColumn: task.status,
      pointerOffset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
      position: {
        x: e.clientX,
        y: e.clientY,
      },
      placeholderHeight: rect.height,
    });
  };

  if (isPlaceholder) {
    return (
      <div
        className="rounded-lg border border-dashed border-[#2c2c3d] bg-[#111118]/50"
        style={{ height: '110px' }}
      />
    );
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      className={`group relative bg-[#111118] border border-[#1a1a24] rounded-lg p-3
        cursor-grab active:cursor-grabbing select-none
        hover:border-[#2c2c3d] hover:bg-[#16161f] transition-all duration-150
        ${isDragging ? 'opacity-40' : 'opacity-100'}`}
    >
      {/* Priority badge + Collab avatars */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </span>

        {collabUsers.length > 0 && (
          <div className="flex items-center">
            {collabUsers.slice(0, 2).map((u, i) => (
              <div
                key={u!.id}
                title={u!.name}
                className="w-5 h-5 rounded-full flex items-center justify-center
                  text-[9px] font-bold border border-[#0a0a0f]"
                style={{
                  backgroundColor: u!.color + '44',
                  color: u!.color,
                  marginLeft: i > 0 ? '-4px' : '0',
                  zIndex: 2 - i,
                  position: 'relative',
                }}
              >
                {u!.initials}
              </div>
            ))}
            {collabUsers.length > 2 && (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center
                  text-[9px] font-bold border border-[#0a0a0f] bg-[#2c2c3d] text-[#e2e2f0]"
                style={{ marginLeft: '-4px', position: 'relative', zIndex: 0 }}
              >
                +{collabUsers.length - 2}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Title */}
      <p className="text-xs font-medium text-[#e2e2f0] leading-snug mb-3 line-clamp-2">
        {task.title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {assignee && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{
              backgroundColor: assignee.color + '33',
              color: assignee.color,
            }}
            title={assignee.name}
          >
            {assignee.initials}
          </div>
        )}

        <span
          className={`text-[10px] font-medium ${
            isToday
              ? 'text-[#ffb547]'
              : isOverdue
              ? 'text-[#ff4d6d]'
              : 'text-[#6b6b8a]'
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}