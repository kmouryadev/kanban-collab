import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Spinner } from "../../ui/spinner";
import { GitBranch } from "lucide-react";
import { useBoardWorkflow } from "../../../hooks/useBoardWorkflow";
import type { List } from "../../../types/list";
import type { BoardTransition } from "../../../types/board";

interface BoardWorkflowModalProps {
  boardId: string;
  lists: List[];
  allowedTransitions: BoardTransition[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const BoardWorkflowModal: React.FC<BoardWorkflowModalProps> = ({
  boardId,
  lists,
  allowedTransitions,
  open,
  onOpenChange,
  trigger,
}) => {
  const { updateWorkflow } = useBoardWorkflow(boardId);
  const [edges, setEdges] = useState<Map<string, Set<string>>>(new Map());
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      const next = new Map<string, Set<string>>();
      allowedTransitions.forEach(({ from, to }) => {
        if (!next.has(from)) next.set(from, new Set());
        next.get(from)!.add(to);
      });
      setEdges(next);
    }
  }

  const toggleEdge = (from: string, to: string) => {
    setEdges((prev) => {
      const next = new Map(prev);
      const destinations = new Set(next.get(from) ?? []);
      if (destinations.has(to)) {
        destinations.delete(to);
      } else {
        destinations.add(to);
      }
      next.set(from, destinations);
      return next;
    });
  };

  const handleSave = () => {
    const transitions: BoardTransition[] = [];
    edges.forEach((destinations, from) => {
      destinations.forEach((to) => transitions.push({ from, to }));
    });

    updateWorkflow.mutate(transitions, {
      onSuccess: () => onOpenChange?.(false),
    });
  };

  const handleUnrestrict = () => {
    setEdges(new Map());
  };

  const isUnrestricted = Array.from(edges.values()).every(
    (destinations) => destinations.size === 0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-lg bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <GitBranch className="w-5 h-5 text-indigo-400" />
            Workflow Rules
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose which lists members may move tasks into from each list.
            Leave everything unchecked to allow members to move tasks
            anywhere (default). You, as owner, can always move tasks to any
            list.
          </DialogDescription>
        </DialogHeader>

        {isUnrestricted && (
          <p className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-md px-3 py-2">
            No rules configured — members can currently move tasks to any
            list.
          </p>
        )}

        <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
          {lists.map((fromList) => (
            <div key={fromList._id} className="space-y-2">
              <p className="text-sm font-medium text-gray-200">
                From <span className="text-indigo-400">{fromList.title}</span>
                , allow moving to:
              </p>
              <div className="flex flex-wrap gap-2">
                {lists
                  .filter((l) => l._id !== fromList._id)
                  .map((toList) => {
                    const checked =
                      edges.get(fromList._id)?.has(toList._id) ?? false;
                    return (
                      <label
                        key={toList._id}
                        className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                          checked
                            ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                            : "bg-gray-900/50 border-gray-600 text-gray-400 hover:bg-gray-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          onChange={() => toggleEdge(fromList._id, toList._id)}
                        />
                        {toList.title}
                      </label>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2 sm:gap-2 pt-4 border-t border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={handleUnrestrict}
            disabled={updateWorkflow.isPending}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Clear All Rules
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={updateWorkflow.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {updateWorkflow.isPending ? (
              <>
                <Spinner className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Workflow"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BoardWorkflowModal;
