import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useShareBoard } from "../../../hooks/useSharedBoard";
import { Loader2, UserPlus, Mail, AlertCircle } from "lucide-react";

interface ShareBoardModalProps {
  boardId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const ShareBoardModal: React.FC<ShareBoardModalProps> = ({
  boardId,
  open,
  onOpenChange,
  trigger,
}) => {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const { share } = useShareBoard(boardId);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (validationError) {
      setValidationError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setValidationError("Email is required");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    share.mutate(trimmedEmail, {
      onSuccess: () => {
        setEmail("");
        setValidationError("");
        onOpenChange?.(false);
      },
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEmail("");
      setValidationError("");
    }
    onOpenChange?.(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <UserPlus className="w-5 h-5 text-indigo-400" />
            Share Board
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Invite team members by email to collaborate on this board
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={handleEmailChange}
                disabled={share.isPending}
                className={`pl-10 bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 ${
                  validationError ? "border-red-500 focus:border-red-500" : ""
                }`}
                autoComplete="email"
                autoFocus
              />
            </div>
            
            {validationError && (
              <div className="flex items-center gap-2 text-red-400 text-xs mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>{validationError}</span>
              </div>
            )}
            
            {!validationError && (
              <p className="text-xs text-gray-500">
                They'll receive an invitation to join this board
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={share.isPending}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={share.isPending || !email.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {share.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShareBoardModal;