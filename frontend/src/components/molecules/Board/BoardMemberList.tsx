import { useState } from "react";
import { Users, Crown, UserMinus } from "lucide-react";
import RemoveMemberDialog from "./RemoveMemberDialog";
import { getAvatarColor, getInitials } from "../../../lib/utils";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Board {
  _id: string;
  title: string;
  description?: string;
  owner: string | User;
  members: (string | User)[];
}

interface BoardMembersListProps {
  board: Board;
  currentUserId?: string;
}

const BoardMembersList: React.FC<BoardMembersListProps> = ({
  board,
  currentUserId,
}) => {
  const ownerId =
    typeof board.owner === "string" ? board.owner : board.owner?._id || "";

  const isCurrentUserOwner = !!currentUserId && currentUserId === ownerId;

  const [memberToRemove, setMemberToRemove] = useState<User | null>(null);

  const memberUsers: User[] = board.members
    .filter((member): member is User => typeof member === "object" && member !== null)
    .filter((member) => member._id && member.name && member.email);

  if (memberUsers.length === 0) {
    return (
      <div className="bg-slate-800/60 rounded-2xl p-4 border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-gray-300">
            Board Members (0)
          </h3>
        </div>
        <p className="text-sm text-gray-500 text-center py-4">
          No members yet. Share this board to start collaborating!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 rounded-2xl p-4 border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-semibold text-gray-300">
          Board Members ({memberUsers.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {memberUsers.map((member) => {
          const isOwner = member._id === ownerId;
          const isCurrentUser = member._id === currentUserId;

          return (
            <div
              key={member._id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                isCurrentUser
                  ? "bg-indigo-500/10 border border-indigo-500/30"
                  : "bg-slate-900/60 hover:bg-slate-900 border border-transparent"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${getAvatarColor(
                  member._id
                )}`}
              >
                {getInitials(member.name)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-white truncate">
                    {member.name}
                  </p>

                  {isOwner && <Crown className="w-3.5 h-3.5 text-yellow-500"   />}

                  {isCurrentUser && (
                    <span className="text-xs text-indigo-400">(You)</span>
                  )}
                </div>

                <p className="text-xs text-gray-500 truncate">{member.email}</p>
              </div>

              <div className="hidden sm:block flex-shrink-0">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isOwner
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {isOwner ? "Owner" : "Member"}
                </span>
              </div>

              {isCurrentUserOwner && !isOwner && (
                <button
                  type="button"
                  onClick={() => setMemberToRemove(member)}
                  aria-label={`Remove ${member.name}`}
                  className="flex-shrink-0 p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {memberUsers.length === 1 && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          Share this board to collaborate with your team
        </p>
      )}

      <RemoveMemberDialog
        boardId={board._id}
        member={memberToRemove}
        open={!!memberToRemove}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
      />
    </div>
  );
};

export default BoardMembersList;
