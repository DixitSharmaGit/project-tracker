import { useStore, hasActiveFilters } from '../store/useStore';
import { USERS } from '../data/seed';
import { STATUSES, PRIORITIES } from '../utils/colors';
import type { Status, Priority } from '../types';

function MultiSelect<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: T[];
  selected: T[];
  onChange: (vals: T[]) => void;
}) {
  const toggle = (val: T) => {
    onChange(
      selected.includes(val)
        ? selected.filter((v) => v !== val)
        : [...selected, val]
    );
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xs text-[#6b6b8a] font-medium mr-0.5">
        {label}:
      </span>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => toggle(opt)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium border
            transition-all duration-100 ${
            selected.includes(opt)
              ? 'bg-[#4f8ef7] text-white border-[#4f8ef7]'
              : 'bg-transparent text-[#6b6b8a] border-[#2c2c3d] hover:border-[#4f8ef7] hover:text-[#e2e2f0]'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function FilterBar() {
  const filters      = useStore((s) => s.filters);
  const setFilter    = useStore((s) => s.setFilter);
  const clearFilters = useStore((s) => s.clearFilters);
  const isActive     = hasActiveFilters(filters);

  return (
    <div className="px-6 py-2.5 border-b border-[#1a1a24] bg-[#0a0a0f]
      flex items-center gap-6 flex-wrap flex-shrink-0">

      <MultiSelect<Status>
        label="Status"
        options={STATUSES}
        selected={filters.statuses}
        onChange={(v) => setFilter({ statuses: v })}
      />

      <MultiSelect<Priority>
        label="Priority"
        options={PRIORITIES}
        selected={filters.priorities}
        onChange={(v) => setFilter({ priorities: v })}
      />

      {/* Assignee */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs text-[#6b6b8a] font-medium mr-0.5">
          Assignee:
        </span>
        {USERS.map((u) => (
          <button
            key={u.id}
            onClick={() => {
              const next = filters.assigneeIds.includes(u.id)
                ? filters.assigneeIds.filter((id) => id !== u.id)
                : [...filters.assigneeIds, u.id];
              setFilter({ assigneeIds: next });
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border
              transition-all duration-100 ${
              filters.assigneeIds.includes(u.id)
                ? 'text-white border-transparent'
                : 'bg-transparent text-[#6b6b8a] border-[#2c2c3d] hover:border-[#4f8ef7] hover:text-[#e2e2f0]'
            }`}
            style={
              filters.assigneeIds.includes(u.id)
                ? { backgroundColor: u.color + '55', borderColor: u.color }
                : {}
            }
          >
            {u.initials}
          </button>
        ))}
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#6b6b8a] font-medium">Due:</span>
        <input
          type="date"
          value={filters.dueDateFrom}
          onChange={(e) => setFilter({ dueDateFrom: e.target.value })}
          className="bg-[#111118] border border-[#2c2c3d] text-xs text-[#e2e2f0]
            rounded-md px-2 py-1 outline-none focus:border-[#4f8ef7] w-32"
        />
        <span className="text-xs text-[#6b6b8a]">→</span>
        <input
          type="date"
          value={filters.dueDateTo}
          onChange={(e) => setFilter({ dueDateTo: e.target.value })}
          className="bg-[#111118] border border-[#2c2c3d] text-xs text-[#e2e2f0]
            rounded-md px-2 py-1 outline-none focus:border-[#4f8ef7] w-32"
        />
      </div>

      {/* Clear filters */}
      {isActive && (
        <button
          onClick={clearFilters}
          className="ml-auto text-xs text-[#ff4d6d] border border-[#ff4d6d]/30
            px-3 py-1 rounded-md hover:bg-[#ff4d6d]/10 transition-colors"
        >
          Clear filters
        </button>
      )}

    </div>
  );
}