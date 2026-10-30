import { describe, expect, it } from "vitest";
import {
  applyTheme,
  getStoredTheme,
  parseStoredTheme,
  resolveThemePreference,
  saveThemePreference,
  THEME_STORAGE_KEY,
  type ThemeRoot,
  type ThemeStorage,
} from "../client/src/contexts/ThemeContext";

describe("Akibit theme helpers", () => {
  it("accepts only the explicit light and dark preference values", () => {
    expect(parseStoredTheme("light")).toBe("light");
    expect(parseStoredTheme("dark")).toBe("dark");
    expect(parseStoredTheme("system")).toBeUndefined();
    expect(parseStoredTheme(null)).toBeUndefined();
  });

  it("uses a valid bootstrapped preference, then safe storage, then light fallback", () => {
    const storage: ThemeStorage = {
      getItem: key => (key === THEME_STORAGE_KEY ? "dark" : null),
      setItem: () => undefined,
    };

    expect(resolveThemePreference("light", storage)).toBe("light");
    expect(resolveThemePreference(undefined, storage)).toBe("dark");
    expect(resolveThemePreference("invalid", undefined)).toBe("light");
  });

  it("tolerates unavailable browser storage without throwing", () => {
    const blockedStorage: ThemeStorage = {
      getItem: () => {
        throw new Error("storage unavailable");
      },
      setItem: () => {
        throw new Error("storage unavailable");
      },
    };

    expect(getStoredTheme(blockedStorage)).toBeUndefined();
    expect(saveThemePreference(blockedStorage, "dark")).toBe(false);
  });

  it("sets both Akibit theme selectors and the browser color scheme", () => {
    const classes = new Set<string>();
    const root: ThemeRoot = {
      dataset: {},
      classList: {
        toggle: (name, enabled) => {
          if (enabled) classes.add(name);
          else classes.delete(name);
        },
      },
      style: {},
    };

    applyTheme(root, "dark");
    expect(root.dataset.theme).toBe("dark");
    expect(root.style.colorScheme).toBe("only dark");
    expect(classes.has("dark")).toBe(true);

    applyTheme(root, "light");
    expect(root.dataset.theme).toBe("light");
    expect(root.style.colorScheme).toBe("only light");
    expect(classes.has("dark")).toBe(false);
  });
});
