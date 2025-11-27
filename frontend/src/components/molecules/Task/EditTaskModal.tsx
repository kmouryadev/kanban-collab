import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "../../ui/select";
import { Button } from "../../ui/button";
import type { Task } from "../../../types/tasks";
import { useTasks } from "../../../hooks/useTasks";
import {
  TaskSchema,
  type TaskFormValues,
} from "../../../validation/task.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "../../ui/spinner";

interface Props {
  boardId: string;
  task: Task | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const EditTaskModal = ({ boardId, task, open, onOpenChange }: Props) => {
  const { update } = useTasks(boardId, task?.listId ?? "");

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    values: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "medium",
    },
  });

  const onSubmit = (values: TaskFormValues) => {
    if (!task) return;

    update.mutate(
      { taskId: task._id, data: values },
      {
        onSuccess: () => onOpenChange(false),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...form.register("title")}
            placeholder="Enter title"
            className="bg-slate-800 border-white/10"
          />

          <Textarea
            {...form.register("description")}
            placeholder="Description"
            className="bg-slate-800 border-white/10"
          />

          <Select
            value={form.watch("priority")}
            onValueChange={(v) =>
              form.setValue("priority", v as TaskFormValues["priority"])
            }
          >
            <SelectTrigger className="bg-slate-800 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/10">
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:flex-1 text-gray-200 border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={update.isPending}
              className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
            >
              {update.isPending ? (
                <>
                  <Spinner className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskModal;
