import type { List } from "../types/list";
import type { Task } from "../types/tasks";

export const generatePosition = (index: number): number => index * 10;

export const reorderListsLocal = (
  lists: List[],
  fromIndex: number,
  toIndex: number
): List[] => {
  const updated = [...lists];
  const [removed] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, removed);

  return updated.map((list, index) => ({
    ...list,
    position: generatePosition(index),
  }));
};

export const reorderTasksOnSameList = (
  tasks: Task[],
  fromIndex: number,
  toIndex: number
): Task[] => {
  const updated = [...tasks];
  const [removed] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, removed);

  return updated.map((task, index) => ({
    ...task,
    position: generatePosition(index),
  }));
};

export const moveTaskToAnotherList = (
  sourceTasks: Task[],
  destTasks: Task[],
  fromIndex: number,
  toIndex: number,
  targetListId: string
): {
  updatedSource: Task[];
  updatedDest: Task[];
} => {
  const sourceClone = [...sourceTasks];
  const destClone = [...destTasks];

  const [moved] = sourceClone.splice(fromIndex, 1);

  const updatedTask = {
    ...moved,
    listId: targetListId,
  };

  destClone.splice(toIndex, 0, updatedTask);

  return {
    updatedSource: sourceClone.map((task, index) => ({
      ...task,
      position: generatePosition(index),
    })),
    updatedDest: destClone.map((task, index) => ({
      ...task,
      position: generatePosition(index),
    })),
  };
};
