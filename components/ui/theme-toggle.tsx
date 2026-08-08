"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div
        className={`h-9 w-9 rounded-lg border border-border/60 bg-white/80 dark:bg-slate-800/80 ${className || ""}`}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const label = isDark ? "Switch to Light mode" : "Switch to Dark mode";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 bg-white/90 text-slate-800 shadow-2xs hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className || ""}`}
      aria-label={label}
      title={label}
    >
      {isDark ? (
        <Sun className="h-4.5 w-4.5 text-amber-400 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
}
