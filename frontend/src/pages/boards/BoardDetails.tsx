// src/pages/boards/BoardDetails.tsx
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";

import { useBoard } from "../../hooks/useBoard";
import { useBoardData } from "../../hooks/useBoardData";
import { useAuthStore } from "../../store/auth.store";

import BoardDndContext from "../../components/molecules/Board/BoardDndContext";
import BoardMembersList from "../../components/molecules/Board/BoardMemberList";

import CreateListModal from "../../components/molecules/List/CreateListModal";
import EditListModal from "../../components/molecules/List/EditListModal";
import DeleteListModal from "../../components/molecules/List/DeleteListModal";

import CreateTaskModal from "../../components/molecules/Task/CreateTaskModal";
import EditTaskModal from "../../components/molecules/Task/EditTaskModal";
import DeleteTaskModal from "../../components/molecules/Task/DeleteTaskModal";
import TaskDetailModal from "../../components/molecules/Task/TaskDetailModal";
import ShareBoardModal from "../../components/molecules/Board/ShareBoardModal";

import { useRealtimeBoard } from "../../hooks/useBoardSocket";

import type { List } from "../../types/list";
import type { Task } from "../../types/tasks";

import { Spinner } from "../../components/ui/spinner";
import { Button } from "../../components/ui/button";
import {
  Plus,
  AlertCircle,
  RefreshCw,
  UserPlus,
  Users,
  ChevronDown,
  ChevronUp,
  Lock,
  ChevronLeft,
} from "lucide-react";

const BoardDetails = () => {
  const { id: boardId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const currentUser = useAuthStore((state) => state.user);

  const { board } = useBoard(boardId!);
  const { listsQuery, lists, tasksByList } = useBoardData(boardId!);

  const [createListOpen, setCreateListOpen] = useState(false);
  const [shareBoardOpen, setShareBoardOpen] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const [listToEdit, setListToEdit] = useState<List | null>(null);
  const [listToDelete, setListToDelete] = useState<List | null>(null);

  const [taskToCreateInList, setTaskToCreateInList] = useState<List | null>(
    null
  );
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToView, setTaskToView] = useState<Task | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const boardData = board.data?.board;

  useRealtimeBoard(boardId!);

  const isOwner = useMemo(() => {
    if (!boardData || !currentUser) return false;
    const ownerId =
      typeof boardData.owner === "string"
        ? boardData.owner
        : boardData.owner._id;
    return currentUser.id === ownerId;
  }, [boardData, currentUser]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (board.isPending || listsQuery.isPending) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Spinner className="w-10 h-10 text-indigo-500" />
          <p className="text-gray-400">Loading board…</p>
        </div>
      </MainLayout>
    );
  }

  if (board.isError || listsQuery.isError) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl text-red-400 font-semibold">
              Failed to load board
            </h2>
            <p className="text-gray-400 text-sm">
              {listsQuery.error?.message || board.error?.message}
            </p>

            <Button
              onClick={() => {
                listsQuery.refetch();
                board.refetch();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const memberCount = boardData?.members?.length || 0;

  return (
    <MainLayout>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/boards")}
            className="flex items-center gap-2 max-w-40"
            aria-label="Go back to boards"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="flex  flex-col items-center gap-3 flex-1 min-w-0">
            <div className="flex flex-col ml-0 sm:ml-2 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold gradient-title truncate">
                  {boardData?.title}
                </h1>
                {!isOwner && (
                  <span className="flex items-center gap-1 text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded-full">
                    <Lock className="w-3 h-3" />
                    View Only
                  </span>
                )}
              </div>

              {boardData?.description && (
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {boardData.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            {memberCount > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowMembers(!showMembers)}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">
                  {memberCount} {memberCount === 1 ? "Member" : "Members"}
                </span>
                <span className="sm:hidden">{memberCount}</span>
                {showMembers ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </Button>
            )}

            {isOwner && (
              <ShareBoardModal
                boardId={boardId!}
                open={shareBoardOpen}
                onOpenChange={setShareBoardOpen}
                trigger={
                  <Button
                    variant="outline"
                    onClick={() => setShareBoardOpen(true)}
                    className="flex-1 border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white"
                  >
                    <UserPlus className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                }
              />
            )}

            <CreateListModal
              boardId={boardId!}
              open={createListOpen}
              onOpenChange={setCreateListOpen}
              trigger={
                isOwner && (
                  <Button
                    onClick={() => setCreateListOpen(true)}
                    className="flex-1  bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Plus className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Create List</span>
                  </Button>
                )
              }
            />
          </div>
        </div>

        {showMembers && boardData && (
          <div className="animate-in slide-in-from-top duration-200">
            <BoardMembersList
              board={boardData}
              currentUserId={currentUser?.id}
            />
          </div>
        )}
      </div>

      {!listsQuery.isPending && lists.length === 0 && isOwner && (
        <div className="flex flex-col items-center min-h-[50vh] justify-center gap-3">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 mb-4">No lists created yet</p>
            <Button
              onClick={() => setCreateListOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First List
            </Button>
          </div>
        </div>
      )}

      {lists.length > 0 && (
        <BoardDndContext
          boardId={boardId!}
          lists={lists}
          tasksByList={tasksByList}
          isMobile={isMobile}
          isOwner={isOwner}
          onOpenListEdit={(list) => setListToEdit(list)}
          onOpenListDelete={(list) => setListToDelete(list)}
          onOpenTaskCreate={(list) => setTaskToCreateInList(list)}
          onOpenTaskEdit={setTaskToEdit}
          onOpenTaskDelete={setTaskToDelete}
          onOpenTaskDetail={setTaskToView}
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
          boardId={boardId!}
          listId={taskToCreateInList._id}
          open={!!taskToCreateInList}
          onOpenChange={(value) => !value && setTaskToCreateInList(null)}
        />
      )}

      {taskToEdit && (
        <EditTaskModal
          boardId={boardId!}
          task={taskToEdit}
          open={!!taskToEdit}
          onOpenChange={(value) => !value && setTaskToEdit(null)}
        />
      )}

      {taskToDelete && (
        <DeleteTaskModal
          boardId={boardId!}
          task={taskToDelete}
          open={!!taskToDelete}
          onOpenChange={(value) => !value && setTaskToDelete(null)}
        />
      )}

      {taskToView && (
        <TaskDetailModal
          task={taskToView}
          isOwner={isOwner}
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
