
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { AuthForm } from "./AuthForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export const AuthModal = ({ isOpen, onClose, onAuthenticated }: AuthModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <AuthForm onClose={onClose} onAuthenticated={onAuthenticated} />
        <DialogClose className="absolute right-4 top-4" />
      </DialogContent>
    </Dialog>
  );
};
