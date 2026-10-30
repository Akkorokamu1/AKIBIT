import { Gamepad2, Sun } from "lucide-react";
import { useId } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, switchable } = useTheme();
  const descriptionId = useId();
  const isDark = theme === "dark";
  const targetMode = isDark ? "Studio" : "Arcade";

  if (!switchable || !toggleTheme) return null;

  return (
    <button
      type="button"
      className="theme-toggle"
      role="switch"
      aria-checked={isDark}
      aria-label="Arcade mode"
      aria-describedby={descriptionId}
      title={`Switch to ${targetMode} mode`}
      onClick={toggleTheme}
      style={{ minWidth: 44, minHeight: 44 }}
    >
      <span className="theme-option studio-option" aria-hidden="true">
        <Sun size={15} strokeWidth={2} />
        <span>Studio</span>
      </span>
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-thumb">
          {isDark ? <Gamepad2 size={14} /> : <Sun size={14} />}
        </span>
      </span>
      <span className="theme-option arcade-option" aria-hidden="true">
        <Gamepad2 size={15} strokeWidth={2} />
        <span>Arcade</span>
      </span>
      <span id={descriptionId} className="sr-only">
        Switch to {targetMode} mode.
      </span>
    </button>
  );
}
