import React, { useMemo } from "react";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";

import type { List } from "../../../types/list";
import type { Task } from "../../../types/tasks";

import TaskCard from "../Task/TaskCard";

import { Button } from "../../ui/button";
import { MoreVertical, Pencil, Trash, Plus, GripVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { getAvatarColor } from "../../../lib/utils";

const makeListId = (listId: string) => `list:${listId}`;
const makeTaskId = (taskId: string, listId: string) =>
  `task:${taskId}:${listId}`;

type BoardMember = { _id: string; name: string; email: string };

interface Props {
  list: List;
  tasks: Task[];
  boardMembers?: BoardMember[];
  isMobile: boolean;
  dndDisabled?: boolean;
  allLists: List[];
  boardId: string;
  isOwner?: boolean;
  onAddTask: (list: List) => void;
  onEditList: (list: List) => void;
  onDeleteList: (list: List) => void;

  onTaskClick: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

const ListColumn: React.FC<Props> = ({
  list,
  tasks,
  boardMembers = [],
  isMobile = false,
  dndDisabled = false,
  allLists,
  boardId,
  isOwner,
  onAddTask,
  onEditList,
  onDeleteList,

  onTaskClick,
  onEditTask,
  onDeleteTask,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: makeListId(list._id),
      disabled: isMobile,
    });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: makeListId(list._id),
  });

  const taskCount = useMemo(() => tasks.length, [tasks]);
  const accentColor = useMemo(() => getAvatarColor(list._id), [list._id]);

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`
        ${isMobile ? "w-full mb-4" : "w-[320px] shrink-0"}
        rounded-2xl bg-slate-800/60 border border-white/10
        shadow-md flex flex-col overflow-hidden
        ${isMobile ? "min-h-[200px]" : "h-[calc(100vh-200px)]"}
      `}
    >
      <div className={`h-1.5 ${accentColor}`} />

      <div className="flex items-center justify-between px-4 pt-3 pb-4">
        <div className="flex items-center gap-2 min-w-0">
          {!isMobile && isOwner && (
            <Button
              size="icon"
              variant="ghost"
              {...listeners}
              {...attributes}
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white hover:bg-white/10 shrink-0"
            >
              <GripVertical className="w-4 h-4" />
            </Button>
          )}

          <h3 className="font-semibold text-white text-base truncate">{list.title}</h3>

          <span className="text-xs px-2 py-0.5 bg-slate-900 rounded-full text-gray-400 shrink-0">
            {taskCount}
          </span>
        </div>

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="shrink-0">
                <MoreVertical className="w-4 h-4 text-gray-300" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-slate-800 border-white/10">
              <DropdownMenuItem
                onClick={() => onEditList(list)}
                className="text-gray-200 hover:bg-white/10"
              >
                <Pencil className="w-4 h-4 mr-2" /> Edit List
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onDeleteList(list)}
                className="text-red-300 hover:bg-red-500/10"
              >
                <Trash className="w-4 h-4 mr-2" /> Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex-1 overflow-hidden px-3" ref={setDroppableRef}>
        <SortableContext
          items={tasks.map((t) => makeTaskId(t._id, list._id))}
          strategy={verticalListSortingStrategy}
        >
          <div
            className={`
              flex flex-col gap-3 
              ${!isMobile && "overflow-y-auto pr-2"} 
              h-full min-h-[100px]
            `}
          >
            {tasks.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-6">
                No tasks yet
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  boardMembers={boardMembers}
                  isMobile={isMobile}
                  dndDisabled={dndDisabled}
                  allLists={allLists}
                  boardId={boardId}
                  onClick={onTaskClick}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>

      <div className="p-3 pt-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10 font-medium"
          onClick={() => onAddTask(list)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add a task
        </Button>
      </div>
    </div>
  );
};

export default ListColumn;
