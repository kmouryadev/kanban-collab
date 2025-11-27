import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTasks } from "../../../hooks/useTasks";
import {
  TaskSchema,
  type TaskFormValues,
} from "../../../validation/task.schema";
import { Spinner } from "../../ui/spinner";

interface Props {
  boardId: string;
  listId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateTaskModal = ({ boardId, listId, open, onOpenChange }: Props) => {
  const { create } = useTasks(boardId, listId);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
    },
  });

  const onSubmit = (values: TaskFormValues) => {
    create.mutate(values, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Task</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new task to this list
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-200">
              Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Task title"
              {...form.register("title")}
              className="bg-slate-800 border-white/10 focus:border-indigo-500"
              disabled={create.isPending}
            />
            {form.formState.errors.title && (
              <p className="text-red-400 text-xs">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-200">
              Description{" "}
              <span className="text-gray-500 font-normal">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Task description"
              {...form.register("description")}
              className="bg-slate-800 border-white/10 focus:border-indigo-500 min-h-[100px]"
              disabled={create.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-gray-200">
              Priority
            </Label>
            <Controller
              name="priority"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={create.isPending}
                >
                  <SelectTrigger
                    id="priority"
                    className="bg-slate-800 border-white/10 focus:border-indigo-500"
                  >
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem
                      value="low"
                      className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
                    >
                      Low
                    </SelectItem>
                    <SelectItem
                      value="medium"
                      className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
                    >
                      Medium
                    </SelectItem>
                    <SelectItem
                      value="high"
                      className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
                    >
                      High
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:flex-1 text-gray-200 border-white/10 hover:bg-white/5"
              onClick={() => onOpenChange(false)}
              disabled={create.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={create.isPending}
              className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
            >
              {create.isPending ? (
                <>
                  <Spinner className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
