import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { login } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);

    try {
      await login();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Sign in to Dashboard
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Alert
                  variant="destructive"
                  className="border-destructive/50 bg-destructive/10"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full h-12 text-base font-medium relative overflow-hidden group cursor-pointer"
            size="lg"
          >
            <span className="relative z-10 flex items-center justify-center">
              {isLoggingIn ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>Sign in</>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
