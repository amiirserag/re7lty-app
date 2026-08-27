import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="sheet-backdrop"
            aria-label="Close sheet"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="sheet-handle" />
            {title && (
              <h3
                className="text-display"
                style={{ fontSize: 18, marginBottom: 16, letterSpacing: "0.08em" }}
              >
                {title}
              </h3>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
