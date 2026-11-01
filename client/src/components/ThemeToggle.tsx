import { Gamepad2, SkipForward, Sun } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@/contexts/ThemeContext";
import {
  PORTAL_VIDEO_URL,
  markPortalSeen,
  portalSeen,
  prefersReducedMotion,
} from "@/lib/portal";

type Phase = "idle" | "film" | "iris-in" | "iris-out" | "film-out";

const IRIS_MS = 320;
const FADE_MS = 360;

export default function ThemeToggle() {
  const { theme, toggleTheme, switchable } = useTheme();
  const descriptionId = useId();
  const isDark = theme === "dark";
  const targetMode = isDark ? "Studio" : "Arcade";

  const [phase, setPhase] = useState<Phase>("idle");
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });
  const videoRef = useRef<HTMLVideoElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const finishing = useRef(false);
  // Mount the overlay only after hydration so prerendered markup stays identical.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Warm the film while the visitor is still in Studio, so the portal never opens onto a blank frame.
  useEffect(() => {
    if (isDark || portalSeen() || prefersReducedMotion()) return;
    const warm = () => {
      const v = videoRef.current;
      if (v && v.preload !== "auto") {
        v.preload = "auto";
        v.load();
      }
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
    };
    const id = w.requestIdleCallback
      ? w.requestIdleCallback(warm)
      : window.setTimeout(warm, 2000);
    return () => {
      if (!w.requestIdleCallback) window.clearTimeout(id);
    };
  }, [isDark]);

  const finishFilm = useCallback(() => {
    if (finishing.current || !toggleTheme) return;
    finishing.current = true;
    markPortalSeen();
    videoRef.current?.pause();
    toggleTheme();
    setPhase("film-out");
    window.setTimeout(() => {
      setPhase("idle");
      finishing.current = false;
      toggleRef.current?.focus();
    }, FADE_MS);
  }, [toggleTheme]);

  const runIris = useCallback(() => {
    if (!toggleTheme) return;
    setPhase("iris-in");
    window.setTimeout(() => {
      toggleTheme();
      setPhase("iris-out");
      window.setTimeout(() => setPhase("idle"), FADE_MS);
    }, IRIS_MS);
  }, [toggleTheme]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!toggleTheme || phase !== "idle") return;

    const rect = event.currentTarget.getBoundingClientRect();
    setOrigin({
      x: `${rect.left + rect.width / 2}px`,
      y: `${rect.top + rect.height / 2}px`,
    });

    if (prefersReducedMotion()) {
      toggleTheme();
      return;
    }

    const video = videoRef.current;
    if (!isDark && !portalSeen() && video) {
      // Play inside the click itself: the gesture is what lets the door-close sound through.
      setPhase("film");
      video.currentTime = 0;
      video.muted = false;
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(finishFilm);
      });
      window.setTimeout(() => skipRef.current?.focus(), 50);
      return;
    }

    runIris();
  };

  useEffect(() => {
    if (phase !== "film") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finishFilm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, finishFilm]);

  if (!switchable || !toggleTheme) return null;

  const overlay = (
    <div
      className={`portal-overlay portal-${phase}`}
      style={
        {
          "--portal-x": origin.x,
          "--portal-y": origin.y,
          "--iris-ms": `${IRIS_MS}ms`,
          "--fade-ms": `${FADE_MS}ms`,
        } as React.CSSProperties
      }
      hidden={phase === "idle"}
      role={phase === "film" ? "dialog" : undefined}
      aria-modal={phase === "film" ? true : undefined}
      aria-label={phase === "film" ? "Entering the Arcade" : undefined}
    >
      <video
        ref={videoRef}
        className="portal-video"
        src={PORTAL_VIDEO_URL}
        preload="none"
        playsInline
        onEnded={finishFilm}
        onError={() => phase === "film" && finishFilm()}
        aria-hidden="true"
      />
      {phase === "film" && (
        <button
          ref={skipRef}
          type="button"
          className="portal-skip"
          onClick={finishFilm}
        >
          Skip <SkipForward size={14} />
        </button>
      )}
    </div>
  );

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="theme-toggle"
        role="switch"
        aria-checked={isDark}
        aria-label="Arcade mode"
        aria-describedby={descriptionId}
        title={`Switch to ${targetMode} mode`}
        onClick={handleClick}
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
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
