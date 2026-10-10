import React, { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  MoveRight,
  GripVertical,
  UserPlus,
  Flag,
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

import { cn, getAvatarColor, getInitials } from "../../../lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { TASKS_QUERY_KEY } from "../../../hooks/useTasks";
import type { TasksResponse } from "../../../types/api";
import { useMoveTask } from "../../../hooks/useMoveTasks";
import { useAssignTask } from "../../../hooks/useAssignTask";
import { useAuthStore } from "../../../store/auth.store";

const makeTaskId = (taskId: string, listId: string) =>
  `task:${taskId}:${listId}`;

type BoardMember = { _id: string; name: string; email: string };

interface Props {
  task: Task;
  boardMembers?: BoardMember[];
  isMobile?: boolean;
  dndDisabled?: boolean;
  allLists: List[];
  boardId: string;
  onClick: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const PRIORITY = {
  low: {
    label: "Low",
    border: "border-l-blue-500",
    chip: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  },
  medium: {
    label: "Medium",
    border: "border-l-yellow-500",
    chip: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
  },
  high: {
    label: "High",
    border: "border-l-red-500",
    chip: "bg-red-500/10 text-red-300 border-red-500/30",
  },
} as const;

const TaskCard: React.FC<Props> = ({
  task,
  boardMembers = [],
  isMobile = false,
  dndDisabled = false,
  allLists,
  boardId,
  onClick,
  onEdit,
  onDelete,
}) => {
  const queryClient = useQueryClient();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: makeTaskId(task._id, task.listId),
      disabled: isMobile || dndDisabled,
    });
  const moveTask = useMoveTask();
  const { assign } = useAssignTask(boardId);
  const currentUser = useAuthStore((state) => state.user);
  const priority = task.priority ?? "medium";
  const priorityInfo = useMemo(() => PRIORITY[priority], [priority]);

  const handleAssign = (assigneeId: string | null) => {
    assign.mutate({ taskId: task._id, assigneeId });
  };

  const handleMoveToList = (newListId: string) => {
    const oldListId = task.listId;

    if (oldListId === newListId) return;
    if (!boardId) return;
    const srcKey = TASKS_QUERY_KEY(boardId, oldListId);
    const destKey = TASKS_QUERY_KEY(boardId, newListId);

    const oldTasks =
      queryClient.getQueryData<TasksResponse>(srcKey)?.tasks ?? [];
    const newTasks =
      queryClient.getQueryData<TasksResponse>(destKey)?.tasks ?? [];

    const updatedOld = oldTasks.filter((oldTask) => oldTask._id !== task._id);
    const newOrder = newTasks.length;

    const updatedNew = [
      ...newTasks,
      {
        ...task,
        listId: newListId,
        order: newOrder,
      },
    ];

    moveTask.mutate({
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
        "p-3.5 rounded-xl bg-slate-800 border border-white/10 border-l-4 shadow-sm",
        "cursor-pointer select-none hover:shadow-lg hover:-translate-y-0.5 transition-all",
        priorityInfo.border
      )}
      onClick={() => onClick(task)}
    >
      <div className="flex items-start justify-between gap-2">
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
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span
                className={cn(
                  "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium",
                  priorityInfo.chip
                )}
              >
                <Flag className="w-3 h-3" />
                {priorityInfo.label}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    onClick={(event) => event.stopPropagation()}
                    className={cn(
                      "flex items-center gap-1.5 text-xs pl-0.5 pr-2 py-0.5 rounded-full border transition-colors",
                      task.assignee
                        ? "bg-slate-900 border-white/10 text-gray-200 hover:bg-slate-700"
                        : "bg-slate-900 border-gray-700 text-gray-500 hover:text-gray-300"
                    )}
                  >
                    {task.assignee ? (
                      <span
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0",
                          getAvatarColor(task.assignee._id)
                        )}
                      >
                        {getInitials(task.assignee.name)}
                      </span>
                    ) : (
                      <UserPlus className="w-3.5 h-3.5 ml-1" />
                    )}
                    {task.assignee ? task.assignee.name : "Unassigned"}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="bg-slate-900 border-white/10 w-48"
                  onClick={(event) => event.stopPropagation()}
                >
                  {currentUser && task.assignee?._id !== currentUser.id && (
                    <DropdownMenuItem
                      onClick={() => handleAssign(currentUser.id)}
                      className="text-gray-200 hover:bg-white/5 cursor-pointer"
                    >
                      Assign to me
                    </DropdownMenuItem>
                  )}

                  {task.assignee && (
                    <DropdownMenuItem
                      onClick={() => handleAssign(null)}
                      className="text-gray-200 hover:bg-white/5 cursor-pointer"
                    >
                      Unassign
                    </DropdownMenuItem>
                  )}

                  {boardMembers.length > 0 && (
                    <>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuLabel className="text-gray-400 text-xs">
                        Assign to
                      </DropdownMenuLabel>
                      {boardMembers
                        .filter((m) => m._id !== task.assignee?._id)
                        .map((member) => (
                          <DropdownMenuItem
                            key={member._id}
                            onClick={() => handleAssign(member._id)}
                            className="text-gray-200 hover:bg-white/5 cursor-pointer"
                          >
                            {member.name}
                          </DropdownMenuItem>
                        ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {task.lastUpdatedBy && (
              <p className="text-xs text-gray-600 mt-1.5">
                Last updated by {task.lastUpdatedBy.name}
              </p>
            )}
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
