import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";

import { useBoard } from "../../hooks/useBoard";
import { useBoardData } from "../../hooks/useBoardData";

import BoardDndContext from "../../components/molecules/Board/BoardDndContext";

import CreateListModal from "../../components/molecules/List/CreateListModal";
import EditListModal from "../../components/molecules/List/EditListModal";
import DeleteListModal from "../../components/molecules/List/DeleteListModal";

import CreateTaskModal from "../../components/molecules/Task/CreateTaskModal";
import EditTaskModal from "../../components/molecules/Task/EditTaskModal";
import DeleteTaskModal from "../../components/molecules/Task/DeleteTaskModal";
import TaskDetailModal from "../../components/molecules/Task/TaskDetailModal";

import type { List } from "../../types/list";
import type { Task } from "../../types/tasks";

import { Button } from "../../components/ui/button";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { Spinner } from "../../components/ui/spinner";

const BoardDetails = () => {
  const { id: boardId } = useParams<{ id: string }>();

  const { board } = useBoard(boardId!);
  const { listsQuery, lists, tasksByList } = useBoardData(boardId!);
  const [createListOpen, setCreateListOpen] = useState(false);

  const [listToEdit, setListToEdit] = useState<List | null>(null);
  const [listToDelete, setListToDelete] = useState<List | null>(null);

  const [taskToCreateInList, setTaskToCreateInList] = useState<List | null>(
    null
  );
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToView, setTaskToView] = useState<Task | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (board.isPending) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Spinner className="w-10 h-10 text-indigo-500" />
            <p className="text-gray-400 text-sm">Loading board...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (board.isError || listsQuery.isError) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-6 max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-400 mb-2">
                Failed to load board
              </h3>
              <p className="text-gray-400 text-sm">
                {listsQuery.error?.message || board.error?.message}
              </p>
            </div>
            <Button
              onClick={() => {
                listsQuery.refetch();
                board.refetch();
              }}
              className="bg-red-600 hover:bg-red-700 inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-title">
              {board.data?.board?.title || "Board"}
            </h1>
            {board.data?.board?.description && (
              <p className="text-gray-400 text-sm mt-1">
                {board.data?.board.description}
              </p>
            )}
          </div>

          <CreateListModal
            boardId={boardId!}
            open={createListOpen}
            onOpenChange={setCreateListOpen}
            trigger={
              <Button
                onClick={() => setCreateListOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create List
              </Button>
            }
          />
        </div>
      </div>
      {!listsQuery.isPending && lists.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-gray-400">No lists yet</p>
          <Button onClick={() => setCreateListOpen(true)} className="mt-4">
            Create First List
          </Button>
        </div>
      )}

      {!listsQuery.isPending && lists.length > 0 && (
        <BoardDndContext
          boardId={boardId!}
          lists={lists}
          tasksByList={tasksByList}
          isMobile={isMobile}
          onOpenListEdit={(list) => setListToEdit(list)}
          onOpenListDelete={(list) => setListToDelete(list)}
          onOpenTaskCreate={(list) => setTaskToCreateInList(list)}
          onOpenTaskEdit={(task) => setTaskToEdit(task)}
          onOpenTaskDelete={(task) => setTaskToDelete(task)}
          onOpenTaskDetail={(task) => setTaskToView(task)}
        />
      )}

      {listToEdit && (
        <EditListModal
          list={listToEdit}
          open={!!listToEdit}
          onOpenChange={(value) => !value && setListToEdit(null)}
        />
      )}

      {listToDelete && (
        <DeleteListModal
          list={listToDelete}
          open={!!listToDelete}
          onOpenChange={(value) => !value && setListToDelete(null)}
        />
      )}

      {taskToCreateInList && (
        <CreateTaskModal
          boardId={board.data.board._id}
          listId={taskToCreateInList._id}
          open={!!taskToCreateInList}
          onOpenChange={(value) => !value && setTaskToCreateInList(null)}
        />
      )}

      {taskToEdit && (
        <EditTaskModal
          boardId={board.data.board._id}
          task={taskToEdit}
          open={!!taskToEdit}
          onOpenChange={(value) => !value && setTaskToEdit(null)}
        />
      )}

      {taskToDelete && (
        <DeleteTaskModal
          boardId={board.data.board._id}
          task={taskToDelete}
          open={!!taskToDelete}
          onOpenChange={(value) => !value && setTaskToDelete(null)}
        />
      )}

      {taskToView && (
        <TaskDetailModal
          task={taskToView}
          open={!!taskToView}
          onOpenChange={(value) => !value && setTaskToView(null)}
          onEdit={(task) => {
            setTaskToView(null);
            setTaskToEdit(task);
          }}
          onDelete={(task) => {
            setTaskToView(null);
            setTaskToDelete(task);
          }}
        />
      )}
    </MainLayout>
  );
};

export default BoardDetails;
