import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useBoards } from "../../../hooks/useBoards";
import {
  updateBoardSchema,
  type UpdateBoardForm,
} from "../../../validation/board.schema";
import { AppToast } from "../../../lib/appToast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Loader2, Palette } from "lucide-react";
import type { Board } from "../../../types/board";

interface EditBoardModalProps {
  board: Board | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditBoardModal = ({ board, open, onOpenChange }: EditBoardModalProps) => {
  const { update } = useBoards();

  const form = useForm<UpdateBoardForm>({
    resolver: zodResolver(updateBoardSchema),
    defaultValues: {
      title: "",
      description: "",
      backgroundColor: "",
    },
  });

  useEffect(() => {
    if (board && open) {
      form.reset({
        title: board.title,
        description: board.description || "",
        backgroundColor: board.backgroundColor || "",
      });
    }
  }, [board, open, form]);

  const onSubmit = (values: UpdateBoardForm) => {
    if (!board) return;

    update.mutate(
      { id: board._id, payload: values },
      {
        onSuccess: () => {
          AppToast.success("Board Updated", "Your board has been updated.");
          onOpenChange(false);
        },
        onError: (error: Error) => {
          AppToast.error("Update Failed", error.message);
        },
      }
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg bg-slate-900 border border-white/10 sm:rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gray-200 font-bold">
            Edit Board
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your board details and settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-200"
            >
              Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="e.g., Team Roadmap, Sprint Planning"
              className="bg-slate-800 border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20 placeholder:text-gray-500"
              disabled={update.isPending}
            />
            {form.formState.errors.title && (
              <p className="text-red-400 text-xs mt-1">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-200"
            >
              Description
              <span className="text-gray-500 font-normal ml-1">(optional)</span>
            </Label>
            <Input
              id="description"
              {...form.register("description")}
              placeholder="A brief description of your board"
              className="bg-slate-800 border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20 placeholder:text-gray-500"
              disabled={update.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="backgroundColor"
              className="text-sm font-medium text-gray-200 flex items-center gap-2"
            >
              <Palette className="w-4 h-4" />
              Background Color
              <span className="text-gray-500 font-normal">(optional)</span>
            </Label>
            <Input
              id="backgroundColor"
              {...form.register("backgroundColor")}
              placeholder="#4f46e5, rgb(79, 70, 229), or linear-gradient(...)"
              className="bg-slate-800 border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20 placeholder:text-gray-500 font-mono text-sm"
              disabled={update.isPending}
            />
            <p className="text-xs text-gray-500">
              Use hex, rgb, or CSS gradient syntax
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:flex-1 text-gray-200 border-white/10 hover:bg-white/5"
              onClick={() => onOpenChange(false)}
              disabled={update.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
              disabled={update.isPending}
            >
              {update.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Board"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBoardModal;
