import React from "react";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";

import type { List } from "../../../types/list";
import type { Task } from "../../../types/tasks";

import { Button } from "../../ui/button";
import { MoreVertical, Pencil, Trash, Plus, GripVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

import TaskCard from "../Task/TaskCard";

const makeListId = (id: string) => `list:${id}`;
const makeTaskId = (taskId: string, listId: string) =>
  `task:${taskId}:${listId}`;

interface Props {
  list: List;
  tasks: Task[];
  isMobile?: boolean;
  allLists?: List[];
  boardId?: string;

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
  isMobile = false,
  allLists = [],
  boardId,
  onAddTask,
  onEditList,
  onDeleteList,
  onTaskClick,
  onEditTask,
  onDeleteTask,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: makeListId(list._id), disabled: isMobile });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: makeListId(list._id),
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`
        ${isMobile ? 'w-full mb-4' : 'w-[320px] shrink-0'} 
        rounded-xl bg-slate-900 border border-white/10 
        p-4 shadow-lg flex flex-col
        ${isMobile ? 'min-h-[200px]' : 'h-[calc(100vh-200px)]'}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {!isMobile && (
            <Button
              size="icon"
              variant="ghost"
              {...listeners}
              {...attributes}
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white hover:bg-white/10"
            >
              <GripVertical className="w-4 h-4" />
            </Button>
          )}

          <h3 className="font-semibold text-white text-lg">{list.title}</h3>
          <span className="text-xs px-2 py-0.5 bg-slate-800 rounded-full text-gray-400">
            {tasks.length}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
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
      </div>

      <div className="flex-1 overflow-hidden" ref={setDroppableRef}>
        <SortableContext
          items={tasks.map((t) => makeTaskId(t._id, list._id))}
          strategy={verticalListSortingStrategy}
        >
          <div className={`flex flex-col gap-3 ${!isMobile && 'overflow-y-auto pr-2'} h-full min-h-[100px]`}>
            {tasks.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-6">
                No tasks yet
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  isMobile={isMobile}
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

      <Button
        className="w-full mt-4 bg-indigo-600 text-white hover:bg-indigo-700"
        onClick={() => onAddTask(list)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Task
      </Button>
    </div>
  );
};

export default ListColumn;