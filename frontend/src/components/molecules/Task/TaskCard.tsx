import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  MoreHorizontal,
  Pencil,
  Trash2,
  MoveRight,
} from "lucide-react";

import type { Task } from "../../../types/tasks";
import type { List } from "../../../types/list";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../../ui/dropdown-menu";

import { cn } from "../../../lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { TASKS_QUERY_KEY } from "../../../hooks/useTasks";
import type { TasksResponse } from "../../../types/api";
import { useMoveTask } from "../../../hooks/useMoveTasks";

const makeTaskId = (taskId: string, listId: string) =>
  `task:${taskId}:${listId}`;

interface Props {
  task: Task;
  isMobile?: boolean;
  allLists?: List[];
  boardId?: string;
  onClick: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityConfig = {
  low: { color: "bg-blue-500", label: "Low" },
  medium: { color: "bg-yellow-500", label: "Medium" },
  high: { color: "bg-red-500", label: "High" },
};

const TaskCard: React.FC<Props> = ({
  task,
  isMobile = false,
  allLists = [],
  boardId,
  onClick,
  onEdit,
  onDelete,
}) => {
  const queryClient = useQueryClient();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: makeTaskId(task._id, task.listId),
      disabled: isMobile,
    });
  const movetask = useMoveTask(task.boardId);
  const priority = task.priority || "medium";
  const priorityInfo = priorityConfig[priority];

  const handleMoveToList = async (newListId: string) => {
    const oldListId = task.listId;
    if (oldListId === newListId) return;
    if (!boardId) return;

    const oldTasks =
      queryClient.getQueryData<TasksResponse>(
        TASKS_QUERY_KEY(boardId, oldListId)
      )?.tasks ?? [];

    const newTasks =
      queryClient.getQueryData<TasksResponse>(
        TASKS_QUERY_KEY(boardId, newListId)
      )?.tasks ?? [];

    const updatedOld = oldTasks.filter((oldTask) => oldTask._id !== task._id);
    const newOrder = newTasks.length;

    const updatedNew = [
      ...newTasks,
      { ...task, listId: newListId, order: newOrder },
    ];

    movetask.mutate({
      taskId: task._id,
      srcListId: oldListId,
      destListId: newListId,
      newOrder,
      newSrc: updatedOld.map((updatedTask) => updatedTask._id),
      newDest: updatedNew.map((updatedTask) => updatedTask._id),
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "p-4 rounded-lg bg-slate-800 border-white/10 border shadow-sm",
        "cursor-pointer select-none hover:shadow-lg transition-all"
      )}
      onClick={() => onClick(task)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {!isMobile && (
            <Button
              {...listeners}
              {...attributes}
              onClick={(event) => event.stopPropagation()}
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white"
              size="icon"
              variant="ghost"
            >
              <GripVertical className="w-4 h-4" />
            </Button>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold truncate">{task.title}</h3>
            {task.description && (
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`w-2 h-2 rounded-full ${priorityInfo.color}`}
                title={`Priority: ${priorityInfo.label}`}
              ></span>
              <span className="text-xs text-gray-500">
                {priorityInfo.label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(event) => event.stopPropagation()}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-slate-900 border-white/10 w-48"
            >
              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(task);
                }}
                className="text-gray-200 hover:bg-white/5 cursor-pointer"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>

              {isMobile && allLists.length > 1 && boardId && (
                <>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuLabel className="text-gray-400 text-xs">
                    Move to List
                  </DropdownMenuLabel>
                  {allLists
                    .filter((list) => list._id !== task.listId)
                    .map((list) => (
                      <DropdownMenuItem
                        key={list._id}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleMoveToList(list._id);
                        }}
                        className="text-gray-200 hover:bg-white/5 cursor-pointer"
                      >
                        <MoveRight className="w-4 h-4 mr-2" />
                        {list.title}
                      </DropdownMenuItem>
                    ))}
                  <DropdownMenuSeparator className="bg-white/10" />
                </>
              )}

              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(task);
                }}
                className="text-red-400 hover:bg-red-500/10 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
