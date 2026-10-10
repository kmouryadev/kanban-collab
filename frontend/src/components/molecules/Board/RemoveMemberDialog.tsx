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
import { useRemoveMember } from "../../../hooks/useBoardMembers";
import { Spinner } from "../../ui/spinner";

interface RemoveMemberDialogProps {
  boardId: string;
  member: { _id: string; name: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RemoveMemberDialog = ({
  boardId,
  member,
  open,
  onOpenChange,
}: RemoveMemberDialogProps) => {
  const { removeMember } = useRemoveMember(boardId);

  const handleRemove = () => {
    if (!member) return;
    removeMember.mutate(member._id, {
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
              Remove Member
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-400 text-base">
            Remove{" "}
            <span className="font-semibold text-white">
              "{member?.name}"
            </span>{" "}
            from this board? They will immediately lose access to it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel
            disabled={removeMember.isPending}
            className="border-white/10 hover:bg-white/5 text-gray-200"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemove}
            disabled={removeMember.isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {removeMember.isPending ? (
              <>
                <Spinner className="w-4 h-4 mr-2 animate-spin" />
                Removing...
              </>
            ) : (
              "Remove Member"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveMemberDialog;
