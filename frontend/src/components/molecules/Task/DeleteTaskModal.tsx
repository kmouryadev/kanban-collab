import type { Task } from "../../../types/tasks";
import { useTasks } from "../../../hooks/useTasks";
import { Spinner } from "../../ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface Props {
  boardId: string;
  task: Task | null;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

const DeleteTaskModal = ({ boardId, task, open, onOpenChange }: Props) => {
  const { remove } = useTasks(boardId, task?.listId ?? "");

  const onDelete = () => {
    if (!task) return;

    remove.mutate(task._id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-900 border border-white/10">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <AlertDialogTitle className="text-2xl text-gray-200">
              Delete Task
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-400 text-base">
            <div className="flex flex-col items-start text-start gap-2">
              <p>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-white">
                  "{task?.title}"
                </span>
                ?
              </p>
              <p>
                This action cannot be undone. All tasks, columns, and data
                associated with this board will be permanently deleted.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel
            disabled={remove.isPending}
            onClick={() => onOpenChange(false)}
            className="border-white/10 hover:bg-white/5 text-gray-200"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={remove.isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {remove.isPending ? (
              <>
                <Spinner className="w-4 h-4 animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTaskModal;
