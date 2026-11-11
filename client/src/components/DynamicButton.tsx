import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium";

const variants = {
  primary: "bg-black text-white",
  secondary: "bg-white text-black ring-1 ring-black/15",
};

export type DynamicButtonProps = {
  label: string;
  icon?: ReactNode;
  stateKey?: string | number;
  variant?: keyof typeof variants;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function DynamicButton({
  label,
  icon,
  stateKey,
  variant = "primary",
  fullWidth = false,
  onClick,
  type = "button",
  disabled = false,
}: DynamicButtonProps) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const reduce = useReducedMotion();
  const contentKey = stateKey ?? label;

  // Measure the label with a hidden copy that has the same padding and classes.
  useLayoutEffect(() => {
    if (fullWidth || !measureRef.current) return;
    setWidth(measureRef.current.offsetWidth);
  }, [label, icon, fullWidth]);

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      animate={{ width: fullWidth ? "100%" : width }}
      transition={
        reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }
      }
      className={`relative overflow-hidden ${base} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } disabled:opacity-50`}
    >
      <span
        ref={measureRef}
        aria-hidden
        className={`${base} invisible absolute left-0 top-0`}
      >
        {icon}
        {label}
      </span>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={contentKey}
          className="inline-flex items-center gap-2"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
        >
          {icon}
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
