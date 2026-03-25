import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { COLLABORATORS, INITIAL_TASKS } from '../data/seed';
import type { CollaboratorPresence } from '../types';

const TASK_POOL = INITIAL_TASKS.slice(0, 50).map((t) => t.id);

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function useCollaboration() {
  const setCollaborators = useStore((s) => s.setCollaborators);

  useEffect(() => {
    let state: CollaboratorPresence[] = COLLABORATORS.map((u) => ({
      userId: u.id,
      taskId: randomFrom(TASK_POOL),
      action: Math.random() > 0.5 ? 'viewing' : 'editing',
    }));

    setCollaborators(state);

    const interval = setInterval(() => {
      const numToMove = Math.random() > 0.5 ? 1 : 2;
      const indices = [...Array(COLLABORATORS.length).keys()]
        .sort(() => Math.random() - 0.5)
        .slice(0, numToMove);

      state = state.map((c, i) => {
        if (!indices.includes(i)) return c;
        return {
          ...c,
          taskId: randomFrom(TASK_POOL),
          action: Math.random() > 0.4 ? 'viewing' : 'editing',
        };
      });

      setCollaborators([...state]);
    }, 3000);

    return () => clearInterval(interval);
  }, [setCollaborators]);
}