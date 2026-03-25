import { useStore } from '../store/useStore';
import { COLLABORATORS } from '../data/seed';
import type { ViewMode } from '../types';

const VIEWS: { id: ViewMode; label: string }[] = [
  { id: 'kanban',   label: 'Board'    },
  { id: 'list',     label: 'List'     },
  { id: 'timeline', label: 'Timeline' },
];

export function Header() {
  const view    = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const collab  = useStore((s) => s.collaborators);

  const activeCount = collab.filter((c) => c.taskId !== null).length;

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a24] bg-[#0a0a0f] z-20 flex-shrink-0">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <span className="text-[#4f8ef7] font-mono font-bold text-lg">
          VLZ
        </span>
        <span className="text-[#2c2c3d] text-lg">|</span>
        <h1 className="text-sm font-semibold text-[#e2e2f0] tracking-wide uppercase">
          Project Tracker
        </h1>
      </div>

      {/* View Switcher */}
      <div className="flex items-center gap-1 bg-[#111118] border border-[#1a1a24] rounded-lg p-1">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
              view === v.id
                ? 'bg-[#4f8ef7] text-white shadow-sm'
                : 'text-[#6b6b8a] hover:text-[#e2e2f0] hover:bg-[#1a1a24]'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Collaboration Bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-[#6b6b8a]">
          {activeCount} {activeCount === 1 ? 'person' : 'people'} viewing
        </span>

        {/* Avatar Stack */}
        <div className="flex items-center">
          {COLLABORATORS.slice(0, 3).map((u, i) => {
            const isActive = collab.some(
              (c) => c.userId === u.id && c.taskId
            );
            return (
              <div
                key={u.id}
                title={u.name}
                className={`w-7 h-7 rounded-full flex items-center justify-center
                  text-xs font-bold border-2 border-[#0a0a0f] transition-all duration-300
                  ${isActive ? 'opacity-100' : 'opacity-30'}`}
                style={{
                  backgroundColor: u.color + '33',
                  color: u.color,
                  marginLeft: i > 0 ? '-6px' : '0',
                  zIndex: 3 - i,
                  position: 'relative',
                }}
              >
                {u.initials}
              </div>
            );
          })}
          {COLLABORATORS.length > 3 && (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center
                text-xs font-bold border-2 border-[#0a0a0f] bg-[#2c2c3d] text-[#e2e2f0]"
              style={{ marginLeft: '-6px', position: 'relative', zIndex: 0 }}
            >
              +{COLLABORATORS.length - 3}
            </div>
          )}
        </div>

        {/* Live indicator */}
        <span className="flex items-center gap-1.5 text-xs text-[#00e5a0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a0] animate-pulse inline-block" />
          Live
        </span>
      </div>

    </header>
  );
}