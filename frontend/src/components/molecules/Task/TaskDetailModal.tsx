import React from "react";
import { Calendar, Edit, Trash2, UserCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import type { Task } from "../../../types/tasks";
import { useAssignTask } from "../../../hooks/useAssignTask";
import { useAuthStore } from "../../../store/auth.store";

type BoardMember = { _id: string; name: string; email: string };

const UNASSIGNED = "__unassigned__";

interface TaskDetailModalProps {
  task: Task | null;
  boardId: string;
  boardMembers?: BoardMember[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const priorityConfig = {
  low: { color: "bg-blue-500 text-blue-100", label: "Low Priority" },
  medium: { color: "bg-yellow-500 text-yellow-100", label: "Medium Priority" },
  high: { color: "bg-red-500 text-red-100", label: "High Priority" },
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  boardId,
  boardMembers = [],
  open,
  onOpenChange,
  onEdit,
  onDelete,
}) => {
  const { assign } = useAssignTask(boardId);
  const currentUser = useAuthStore((state) => state.user);

  if (!task) return null;

  const priority = task.priority || "medium";
  const priorityInfo = priorityConfig[priority];
  const createdDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const updatedDate = new Date(task.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-8">
              <DialogTitle className="text-2xl font-bold text-white mb-3">
                {task.title}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}
                >
                  {priorityInfo.label}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              Description
            </h3>
            <div className="bg-slate-800 rounded-lg p-4 border border-white/5">
              <p className="text-gray-200 whitespace-pre-wrap">
                {task.description || "No description provided"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2">
                Created
              </h3>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{createdDate}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2">
                Last Updated
              </h3>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{updatedDate}</span>
              </div>
              {task.lastUpdatedBy && (
                <p className="text-xs text-gray-500 mt-1">
                  by {task.lastUpdatedBy.name}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              Assignee
            </h3>
            <div className="flex items-center gap-3">
              <Select
                value={task.assignee?._id ?? UNASSIGNED}
                onValueChange={(value) =>
                  assign.mutate({
                    taskId: task._id,
                    assigneeId: value === UNASSIGNED ? null : value,
                  })
                }
              >
                <SelectTrigger className="w-56 bg-slate-800 border-white/10 text-white">
                  <UserCircle2 className="w-4 h-4 mr-2 shrink-0" />
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white">
                  <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                  {boardMembers.map((member) => (
                    <SelectItem key={member._id} value={member._id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {currentUser && task.assignee?._id !== currentUser.id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    assign.mutate({
                      taskId: task._id,
                      assigneeId: currentUser.id,
                    })
                  }
                  className="border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white"
                >
                  Assign to me
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10">
          <Button
            variant="outline"
            onClick={() => {
              onEdit?.(task);
              onOpenChange(false);
            }}
            className="border-white/10 text-white hover:bg-white/5"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Task
          </Button>
          <Button
            variant="default"
            onClick={() => {
              onDelete?.(task);
              onOpenChange(false);
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
