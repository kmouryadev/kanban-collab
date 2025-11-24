import type { FC } from "react";
import { Pencil, Trash2, Calendar, Clock } from "lucide-react";
import type { Board } from "../../../types/board";
import { Button } from "../../ui/button";
import { format } from "date-fns";

interface Props {
  board: Board;
  onCardClick: (boardId: string) => void;
  onEdit: (boardId: string) => void;
  onDelete: (boardId: string) => void;
  isDeleting?: boolean;
}

const BoardCard: FC<Props> = ({
  board,
  onCardClick,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const handleCardClick = () => {
    onCardClick(board._id);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    onEdit(board._id);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDelete(board._id);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd-MM-yyyy HH:mm");
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getColorBrightness = (color: string): number => {
    if (color.startsWith("#")) {
      const hex = color.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return (r * 299 + g * 587 + b * 114) / 1000;
    }

    if (color.startsWith("rgb")) {
      const match = color.match(/\d+/g);
      if (match && match.length >= 3) {
        const r = parseInt(match[0]);
        const g = parseInt(match[1]);
        const b = parseInt(match[2]);
        return (r * 299 + g * 587 + b * 114) / 1000;
      }
    }

    return 128;
  };

  const backgroundColor =
    board.backgroundColor ||
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  const isLightBackground = getColorBrightness(backgroundColor) > 128;

  const editButtonClass = isLightBackground
    ? "flex-1 bg-black/15 hover:bg-black/25 text-gray-900 border-0 backdrop-blur-sm font-medium"
    : "flex-1 bg-white/15 hover:bg-white/25 text-white border-0 backdrop-blur-sm font-medium";

  const deleteButtonClass = isLightBackground
    ? "flex-1 bg-red-600/80 hover:bg-red-700/90 text-white border-0 backdrop-blur-sm disabled:opacity-50 font-medium"
    : "flex-1 bg-red-500/25 hover:bg-red-500/40 text-red-100 border-0 backdrop-blur-sm disabled:opacity-50 font-medium";

  const textColorClass = isLightBackground ? "text-gray-900" : "text-white";
  const textSecondaryClass = isLightBackground
    ? "text-gray-700"
    : "text-white/80";
  const timestampColorClass = isLightBackground
    ? "text-gray-600"
    : "text-white/70";
  const overlayClass = isLightBackground
    ? "absolute inset-0 bg-white/10 group-hover:bg-white/5 transition-colors"
    : "absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors";

  return (
    <div
      role="button"
      onClick={handleCardClick}
      className="group relative w-full cursor-pointer rounded-xl overflow-hidden shadow-lg border border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300 flex flex-col"
      style={{
        background: backgroundColor,
      }}
    >
      <div className={overlayClass} />

      <div className="relative p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className={`text-xl font-bold mb-3 ${textColorClass}`}>
            {board.title}
          </h3>

          <div className="mb-4 min-h-[90px]">
            {board.description ? (
              <p className={`text-sm leading-relaxed ${textSecondaryClass}`}>
                {truncateText(board.description, 150)}
              </p>
            ) : (
              <div
                className={`min-h-[90px] flex items-center justify-center py-4 px-3 rounded-lg ${
                  isLightBackground
                    ? "bg-black/10 border border-black/10"
                    : "bg-black/20 border border-white/10"
                }`}
              >
                <p
                  className={`text-xs italic ${
                    isLightBackground ? "text-gray-500" : "text-white/50"
                  }`}
                >
                  No description
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 mb-3">
            <div
              className={`flex items-center gap-2 text-xs ${timestampColorClass}`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Created: {formatDate(board.createdAt)}</span>
            </div>
            <div
              className={`flex items-center gap-2 text-xs ${timestampColorClass}`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Updated: {formatDate(board.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
          <Button onClick={handleEdit} size="sm" className={editButtonClass}>
            <Pencil className="w-4 h-4 mr-1.5" />
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            size="sm"
            disabled={isDeleting}
            className={deleteButtonClass}
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <div
        className={`relative px-5 py-2 ${
          isLightBackground
            ? "border-t border-black/10 bg-black/5"
            : "border-t border-white/10 bg-black/20"
        }`}
      >
        <div className="flex items-center justify-center">
          <span
            className={`text-xs opacity-0 group-hover:opacity-100 transition-opacity ${
              isLightBackground ? "text-gray-500" : "text-white/50"
            }`}
          >
            Click to open →
          </span>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
