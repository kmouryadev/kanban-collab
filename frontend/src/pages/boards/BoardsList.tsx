import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import BoardCard from "../../components/molecules/Board/BoardCard";
import CreateBoardModal from "../../components/molecules/Board/CreateBoardModal";
import EditBoardModal from "../../components/molecules/Board/EditBoardModal";
import DeleteBoardModal from "../../components/molecules/Board/DeleteBoardModel";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Spinner } from "../../components/ui/spinner";
import { useBoards } from "../../hooks/useBoards";
import { useEffect } from "react";
import { AppToast } from "../../lib/appToast";
import {
  AlertCircle,
  Plus,
  RefreshCw,
  Search,
  X,
  ArrowUpDown,
  Calendar,
  Clock,
} from "lucide-react";
import type { Board } from "../../types/board";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

type SortOption = "newest" | "oldest" | "recently-updated" | "least-updated";

const BoardsListPage = () => {
  const { list, remove } = useBoards();
  const navigate = useNavigate();
  const [deletingBoardId, setDeletingBoardId] = useState<string | null>(null);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [deletingBoard, setDeletingBoard] = useState<Board | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recently-updated");

  useEffect(() => {
    if (list.isError) {
      AppToast.error("Failed to load boards", list.error?.message);
    }
  }, [list.isError, list.error?.message]);

  const boards = list.data?.boards ?? [];

  const filteredAndSortedBoards = useMemo(() => {
    let filtered = boards;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((b) => b.title.toLowerCase().includes(q));
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "recently-updated":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "least-updated":
          return (
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          );
        default:
          return 0;
      }
    });

    return sorted;
  }, [boards, searchQuery, sortBy]);

  const handleCardClick = (boardId: string) => {
    navigate(`/board/${boardId}`);
  };

  const handleEdit = (boardId: string) => {
    const board = list.data?.boards?.find((b) => b._id === boardId);
    if (board) {
      setEditingBoard(board);
      setEditModalOpen(true);
    }
  };

  const handleDelete = (boardId: string) => {
    const board = list.data?.boards?.find((b) => b._id === boardId);
    if (board) {
      setDeletingBoard(board);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    if (!deletingBoard) return;

    setDeletingBoardId(deletingBoard._id);
    remove.mutate(deletingBoard._id, {
      onSuccess: () => {
        AppToast.success("Board Deleted", "The board has been deleted.");
        setDeletingBoardId(null);
        setDeleteModalOpen(false);
        setDeletingBoard(null);
      },
      onError: (error: Error) => {
        AppToast.error("Delete Failed", error.message);
        setDeletingBoardId(null);
      },
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-title">
              Your Boards
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Manage all collaborative Kanban boards in one place.
            </p>
          </div>

          <CreateBoardModal
            trigger={
              <Button className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40 inline-flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Create Board
              </Button>
            }
          />
        </div>

        {!list.isPending &&
          !list.isError &&
          list.data?.boards &&
          list.data.boards.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search boards by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-slate-800 border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20 placeholder:text-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                    aria-label="Clear search"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-full sm:w-[220px] bg-slate-800 border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10">
                  <SelectItem
                    value="recently-updated"
                    className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Recently Updated
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="least-updated"
                    className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Least Updated
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="newest"
                    className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Newest First
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="oldest"
                    className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Oldest First
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

        {!list.isPending && !list.isError && searchQuery && (
          <div className="text-sm text-gray-400">
            Found {filteredAndSortedBoards.length} board
            {filteredAndSortedBoards.length !== 1 ? "s" : ""} matching "
            {searchQuery}"
          </div>
        )}
      </div>

      {list.isPending && (
        <div className="flex flex-col items-center justify-center gap-4 min-h-[60vh]">
          <Spinner className="w-10 h-10 text-indigo-500" />
          <p className="text-gray-400 text-sm">Loading your boards...</p>
        </div>
      )}

      {!list.isPending && list.isError && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-6 max-w-md w-full text-center p-8 rounded-xl border border-red-500/20 bg-red-500/5">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>

            <h3 className="text-xl font-semibold text-red-400 mb-2">
              Could not fetch boards
            </h3>

            <Button
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium inline-flex items-center justify-center gap-2 transition-all"
              onClick={() => list.refetch()}
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {!list.isPending &&
        !list.isError &&
        (!list.data?.boards || list.data.boards.length === 0) && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="max-w-md w-full p-12 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] text-center backdrop-blur-sm">
              <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
                <Plus className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-200 mb-3">
                No boards yet
              </h3>
              <p className="text-gray-400 mb-6">
                Create your first board to start organizing your tasks and
                collaborating with your team.
              </p>
              <CreateBoardModal
                trigger={
                  <Button className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40 inline-flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Your First Board
                  </Button>
                }
              />
            </div>
          </div>
        )}

      {!list.isPending &&
        !list.isError &&
        list.data?.boards &&
        list.data.boards.length > 0 &&
        filteredAndSortedBoards.length === 0 && (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="max-w-md w-full p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-500/10 flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-200 mb-3">
                No boards found
              </h3>
              <p className="text-gray-400 mb-6">
                No boards match your search for "{searchQuery}"
              </p>
              <Button
                onClick={clearSearch}
                variant="outline"
                className="border-white/10 hover:bg-white/5 text-gray-200"
              >
                Clear Search
              </Button>
            </div>
          </div>
        )}

      {!list.isPending &&
        !list.isError &&
        filteredAndSortedBoards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedBoards.map((b) => (
              <BoardCard
                key={b._id}
                board={b}
                onCardClick={handleCardClick}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deletingBoardId === b._id}
              />
            ))}
          </div>
        )}

      <EditBoardModal
        board={editingBoard}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />

      <DeleteBoardModal
        board={deletingBoard}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        isDeleting={deletingBoardId === deletingBoard?._id}
      />
    </MainLayout>
  );
};

export default BoardsListPage;
