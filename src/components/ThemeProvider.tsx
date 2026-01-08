import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

function sendLocalIngest(payload: any) {
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    try {
      fetch("http://127.0.0.1:7242/ingest/edd1edcc-d15d-43a6-9166-0f43d8e0a0e0", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch (_) {}
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "rotection-ui-theme",
  ...props
}: ThemeProviderProps) {
  try {
    const storedTheme = localStorage.getItem(storageKey);
    sendLocalIngest({ location: "ThemeProvider.tsx", message: "theme init", data: { defaultTheme, storedTheme, storageKey }, timestamp: Date.now() });
  } catch (e) {
    sendLocalIngest({ location: "ThemeProvider.tsx", message: "ThemeProvider localStorage error", data: { error: e instanceof Error ? e.message : String(e) }, timestamp: Date.now() });
  }

  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    } catch (e) {
      sendLocalIngest({ location: "ThemeProvider.tsx:useState", message: "localStorage access failed", data: { error: e instanceof Error ? e.message : String(e) }, timestamp: Date.now() });
      return defaultTheme;
    }
  });

  useEffect(() => {
    sendLocalIngest({ location: "ThemeProvider.tsx:useEffect", message: "applying theme", data: { theme }, timestamp: Date.now() });
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      sendLocalIngest({ location: "ThemeProvider.tsx", message: "System theme detected", data: { systemTheme }, timestamp: Date.now() });
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (t: Theme) => {
      sendLocalIngest({ location: "ThemeProvider.tsx:setTheme", message: "setTheme called", data: { newTheme: t, storageKey }, timestamp: Date.now() });
      try {
        localStorage.setItem(storageKey, t);
        sendLocalIngest({ location: "ThemeProvider.tsx", message: "Theme saved to localStorage", data: { theme: t }, timestamp: Date.now() });
      } catch (e) {
        sendLocalIngest({ location: "ThemeProvider.tsx", message: "localStorage.setItem failed", data: { error: e instanceof Error ? e.message : String(e) }, timestamp: Date.now() });
      }
      setTheme(t);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
