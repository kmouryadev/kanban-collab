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
import { Loader2, AlertTriangle } from "lucide-react";
import type { Board } from "../../../types/board";

interface DeleteBoardModalProps {
  board: Board | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

const DeleteBoardModal = ({
  board,
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: DeleteBoardModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-900 border border-white/10">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <AlertDialogTitle className="text-2xl text-gray-200">
              Delete Board
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-400 text-base">
            <div className="flex flex-col items-start text-start gap-2">
              <p>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-white">
                  "{board?.title}"
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
            disabled={isDeleting}
            className="border-white/10 hover:bg-white/5 text-gray-200"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Board"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBoardModal;
