import { useAuth } from "@/hooks/use-auth";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, login } = useAuth();
  const loginAttempted = useRef(false);

  useEffect(() => {
    // Only attempt login once and only if not authenticated
    if (!isLoading && !isAuthenticated && !loginAttempted.current) {
      loginAttempted.current = true;
      login().catch(console.error);
    }
  }, [isAuthenticated, isLoading, login]);

  // Reset login attempt flag when user logs out
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginAttempted.current = false;
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="relative w-16 h-16 mx-auto">
            <motion.div
              className="absolute inset-0 border-4 border-primary/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="text-muted-foreground font-medium">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="relative w-16 h-16 mx-auto">
            <motion.div
              className="absolute inset-0 border-4 border-primary/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="text-muted-foreground font-medium">
            Please sign in with Google...
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
