import { useStore } from './store/useStore';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KanbanView } from './components/KanbanView';
import { ListView } from './components/ListView';
import { TimelineView } from './components/TimelineView';
import { useCollaboration } from './hooks/useCollaboration';

export default function App() {
  const view = useStore((s) => s.view);
  useCollaboration();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0a0f]">
      <Header />
      <FilterBar />
      <main className="flex-1 overflow-hidden">
        {view === 'kanban'   && <KanbanView />}
        {view === 'list'     && <ListView />}
        {view === 'timeline' && <TimelineView />}
      </main>
    </div>
  );
}