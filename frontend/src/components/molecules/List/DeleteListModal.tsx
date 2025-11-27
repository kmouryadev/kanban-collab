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
import type { List } from "../../../types/list";
import { useLists } from "../../../hooks/useLists";
import { Spinner } from "../../ui/spinner";

interface DeleteListModalProps {
  list: List;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteListModal = ({
  list,
  open,
  onOpenChange,
}: DeleteListModalProps) => {
  const { remove } = useLists(list.boardId);

  const handleDelete = () => {
    remove.mutate(list._id, {
      onSuccess: () => {
        onOpenChange(false);
      },
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
              Delete List
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-400 text-base">
            <div className="flex flex-col items-start text-start gap-2"></div>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">"{list.title}"</span>?{" "}
            </p>
            <p>
              This action cannot be undone. All tasks in this list will also be
              permanently deleted.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel
            disabled={remove.isPending}
            className="border-white/10 hover:bg-white/5 text-gray-200"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={remove.isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {remove.isPending ? (
              <>
                <Spinner className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete List"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteListModal;
