import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "akibit-theme";
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export interface ThemeStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface ThemeRoot {
  dataset: { theme?: string };
  classList: { toggle(className: string, force?: boolean): void };
  style: { colorScheme?: string };
}

export interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Retained for starter-component compatibility; Akibit defaults to light. */
  defaultTheme?: Theme;
  /** Enables the optional, persisted Studio/Arcade switch. */
  switchable?: boolean;
}

/** Accept only the two explicit themes, never arbitrary stored values. */
export function parseStoredTheme(value: unknown): Theme | undefined {
  return value === "light" || value === "dark" ? value : undefined;
}

/** Read storage defensively: privacy modes and embedded previews can throw here. */
export function getStoredTheme(
  storage?: ThemeStorage | null
): Theme | undefined {
  try {
    return storage
      ? parseStoredTheme(storage.getItem(THEME_STORAGE_KEY))
      : undefined;
  } catch {
    return undefined;
  }
}

/** Resolve a bootstrapped document preference before falling back to local storage. */
export function resolveThemePreference(
  bootstrappedTheme: unknown,
  storage?: ThemeStorage | null,
  fallback: Theme = "light"
): Theme {
  return (
    parseStoredTheme(bootstrappedTheme) ?? getStoredTheme(storage) ?? fallback
  );
}

/** Persist only an explicit visitor choice and silently tolerate unavailable storage. */
export function saveThemePreference(
  storage: ThemeStorage | null | undefined,
  theme: Theme
): boolean {
  try {
    if (!storage) return false;
    storage.setItem(THEME_STORAGE_KEY, theme);
    return true;
  } catch {
    return false;
  }
}

/** Keep both selectors available for Akibit's custom CSS and existing dark utilities. */
export function applyTheme(root: ThemeRoot, theme: Theme) {
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  // "only" stops browsers and dark-mode extensions from auto-darkening Studio.
  root.style.colorScheme = theme === "dark" ? "only dark" : "only light";
}

function browserStorage(): ThemeStorage | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  // Always begin with light so server and first client render share identical markup.
  const [theme, setTheme] = useState<Theme>("light");
  const [preferenceResolved, setPreferenceResolved] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const root =
      typeof document === "undefined" ? undefined : document.documentElement;
    const preferredTheme = switchable
      ? resolveThemePreference(
          root?.dataset.theme,
          browserStorage(),
          defaultTheme
        )
      : defaultTheme;

    if (preferredTheme !== theme) setTheme(preferredTheme);
    setPreferenceResolved(true);
    // Resolve after hydration but before paint; keep the checked state aligned with the bootstrap.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!preferenceResolved || typeof document === "undefined") return;
    applyTheme(document.documentElement, theme);
    document
      .querySelector('meta[name="color-scheme"]')
      ?.setAttribute("content", theme === "dark" ? "only dark" : "only light");
  }, [preferenceResolved, theme]);

  const toggleTheme = useCallback(() => {
    if (!switchable) return;
    setTheme(currentTheme => {
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      saveThemePreference(browserStorage(), nextTheme);
      return nextTheme;
    });
  }, [switchable]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: switchable ? toggleTheme : undefined,
        switchable,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
