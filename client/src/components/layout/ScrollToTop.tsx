import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ScrollToTopProps {
  show: boolean;
  onClick: () => void;
}

export function ScrollToTop({ show, onClick }: ScrollToTopProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={onClick}
          className="cursor-pointer fixed bottom-8 right-4 md:right-8 z-40 w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center transition-all hover:scale-110"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
