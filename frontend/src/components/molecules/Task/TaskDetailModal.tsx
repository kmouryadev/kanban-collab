import React from "react";
import { Calendar, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import type { Task } from "../../../types/tasks";

interface TaskDetailModalProps {
  task: Task | null;
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
  open,
  onOpenChange,
  onEdit,
  onDelete,
}) => {
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
