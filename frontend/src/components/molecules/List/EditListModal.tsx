import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useLists } from "../../../hooks/useLists";
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
import { Spinner } from "../../ui/spinner";
import type { List } from "../../../types/list";
import {
  updateListSchema,
  type UpdateListForm,
} from "../../../validation/list.schema";

interface EditListModalProps {
  list: List;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditListModal = ({ list, open, onOpenChange }: EditListModalProps) => {
  const { update } = useLists(list.boardId);

  const form = useForm<UpdateListForm>({
    resolver: zodResolver(updateListSchema),
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    if (list && open) {
      form.reset({
        title: list.title,
      });
    }
  }, [list, open, form]);

  const onSubmit = (values: UpdateListForm) => {
    console.log("list: ", list);
    update.mutate(
      { listId: list._id, data: values },
      {
        onSuccess: () => {
          onOpenChange(false);
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
      <DialogContent className="max-w-md bg-slate-900 border border-white/10 sm:rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gray-200 font-bold">
            Edit List
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your list details
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
              placeholder="List title"
              className="bg-slate-800 border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20 placeholder:text-gray-500"
              disabled={update.isPending}
            />
            {form.formState.errors.title && (
              <p className="text-red-400 text-xs mt-1">
                {form.formState.errors.title.message}
              </p>
            )}
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
                  <Spinner className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update List"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditListModal;
