import React, { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from "@dnd-kit/core";

import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { List } from "../../../types/list";
import type { Task } from "../../../types/tasks";
import type { TasksResponse } from "../../../types/api";

import {
  reorderListsLocal,
  reorderTasksOnSameList,
  moveTaskToAnotherList,
} from "../../../utils/reorder";

import { useLists } from "../../../hooks/useLists";
import { taskApi } from "../../../api/taskApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import ListColumn from "../List/ListColumn";
import { TASKS_QUERY_KEY } from "../../../hooks/useTasks";
import { AppToast } from "../../../lib/appToast";
import { useMoveTask } from "../../../hooks/useMoveTasks";

const makeListId = (id: string) => `list:${id}`;

type DragMeta =
  | { type: "list"; listId: string }
  | { type: "task"; taskId: string; listId: string }
  | null;

const parseId = (id: string): DragMeta => {
  if (id.startsWith("list:")) {
    return { type: "list", listId: id.split(":")[1] };
  }
  if (id.startsWith("task:")) {
    const [, taskId, listId] = id.split(":");
    return { type: "task", taskId, listId };
  }
  return null;
};

type Props = {
  boardId: string;
  lists: List[];
  tasksByList: Record<string, Task[]>;
  isMobile?: boolean;

  onOpenTaskEdit?: (task: Task) => void;
  onOpenTaskCreate?: (list: List) => void;
  onOpenTaskDelete?: (task: Task) => void;
  onOpenListEdit?: (list: List) => void;
  onOpenListDelete?: (list: List) => void;
  onOpenTaskDetail?: (task: Task) => void;
};

const BoardDndContext: React.FC<Props> = ({
  boardId,
  lists,
  tasksByList,
  isMobile = false,
  onOpenTaskEdit,
  onOpenTaskCreate,
  onOpenListEdit,
  onOpenListDelete,
  onOpenTaskDelete,
  onOpenTaskDetail,
}) => {
  const { reorder: reorderListsMutation } = useLists(boardId);
  const moveTask = useMoveTask(boardId);
  const queryClient = useQueryClient();

  const { mutate: reorderTasks } = useMutation({
    mutationFn: async ({
      listId,
      payload,
    }: {
      listId: string;
      payload: string[];
    }) => taskApi.reorderTasks(listId, payload),
    onMutate: async ({ listId, payload }) => {
      const key = TASKS_QUERY_KEY(boardId, listId);
      await queryClient.cancelQueries({ queryKey: key });

      const prev = queryClient.getQueryData<TasksResponse>(key);

      if (prev?.tasks) {
        const map = new Map(prev.tasks.map((task) => [task._id, { ...task }]));
        const updated = payload
          .map((id, idx) => {
            const item = map.get(id);
            if (!item) return null;
            return { ...item, order: idx };
          })
          .filter(Boolean) as Task[];

        queryClient.setQueryData<TasksResponse>(key, {
          ...prev,
          tasks: updated,
        });
      }

      return { prev };
    },
    onError: (err: Error, vars, ctx) => {
      const key = TASKS_QUERY_KEY(boardId, vars.listId);
      if (ctx?.prev) {
        queryClient.setQueryData<TasksResponse>(key, ctx.prev);
      }
      AppToast.error("Task reorder failed", err.message);
    },
    onSettled: (_data, _err, vars) => {
      const key = TASKS_QUERY_KEY(boardId, vars.listId);
      queryClient.invalidateQueries({ queryKey: key });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;
      if (active.id === over.id) return;

      const activeId = parseId(String(active.id));
      const overId = parseId(String(over.id));
      if (!activeId || !overId) return;

      if (activeId.type === "list" && overId.type === "list") {
        const fromIndex = lists.findIndex(
          (list) => list._id === activeId.listId
        );
        const toIndex = lists.findIndex((list) => list._id === overId.listId);
        if (fromIndex < 0 || toIndex < 0) return;

        const reordered = reorderListsLocal(lists, fromIndex, toIndex);
        const orderedIds = reordered.map((list) => list._id);

        reorderListsMutation.mutate(orderedIds);
        return;
      }

      if (activeId.type === "task") {
        const src = activeId.listId;
        const dst = overId.type === "task" ? overId.listId : overId.listId;

        const sourceTasks = tasksByList[src] ?? [];
        const destTasks = tasksByList[dst] ?? [];

        const fromIndex = sourceTasks.findIndex(
          (task) => task._id === activeId.taskId
        );
        if (fromIndex < 0) return;

        let toIndex: number;

        if (overId.type === "task") {
          toIndex = destTasks.findIndex((task) => task._id === overId.taskId);
          if (toIndex < 0) return;
        } else {
          toIndex = destTasks.length;
        }

        if (src === dst) {
          const updated = reorderTasksOnSameList(
            sourceTasks,
            fromIndex,
            toIndex
          );
          const orderedIds = updated.map((task) => task._id);

          reorderTasks({ listId: src, payload: orderedIds });
          return;
        }

        const { updatedSource, updatedDest } = moveTaskToAnotherList(
          sourceTasks,
          destTasks,
          fromIndex,
          toIndex,
          dst
        );

        const newSrcIds = updatedSource.map((task) => task._id);
        const newDestIds = updatedDest.map((task) => task._id);

        moveTask.mutate({
          taskId: activeId.taskId,
          srcListId: src,
          destListId: dst,
          newOrder: toIndex,
          newSrc: newSrcIds,
          newDest: newDestIds,
        });

        return;
      }
    },
    [lists, tasksByList, reorderListsMutation, reorderTasks, moveTask]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={lists.map((l) => makeListId(l._id))}
        strategy={horizontalListSortingStrategy}
      >
        <div
          className={`flex ${
            isMobile ? "flex-col" : "gap-4 overflow-x-auto"
          } pb-6`}
        >
          {lists.map((list) => (
            <div key={list._id} data-id={makeListId(list._id)}>
              <ListColumn
                list={list}
                tasks={tasksByList[list._id] ?? []}
                isMobile={isMobile}
                allLists={lists}
                boardId={boardId}
                onAddTask={() => onOpenTaskCreate?.(list)}
                onEditList={() => onOpenListEdit?.(list)}
                onDeleteList={() => onOpenListDelete?.(list)}
                onTaskClick={(task) => onOpenTaskDetail?.(task)}
                onEditTask={(task) => onOpenTaskEdit?.(task)}
                onDeleteTask={(task) => onOpenTaskDelete?.(task)}
              />
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default BoardDndContext;
