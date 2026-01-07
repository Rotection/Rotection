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

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "rotection-ui-theme",
  ...props
}: ThemeProviderProps) {
  // #region agent log
  try{const storedTheme=localStorage.getItem(storageKey);fetch('http://127.0.0.1:7242/ingest/edd1edcc-d15d-43a6-9166-0f43d8e0a0e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeProvider.tsx:29',message:'ThemeProvider init - reading localStorage',data:{storedTheme,defaultTheme,storageKey},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});}catch(e){fetch('http://127.0.0.1:7242/ingest/edd1edcc-d15d-43a6-9166-0f43d8e0a0e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeProvider.tsx:29',message:'ThemeProvider localStorage error',data:{error:e instanceof Error?e.message:'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});}
  // #endregion
  const [theme, setTheme] = useState<Theme>(
    () => {
      try {
        return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
      } catch (e) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/edd1edcc-d15d-43a6-9166-0f43d8e0a0e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeProvider.tsx:32',message:'localStorage access failed in useState',data:{error:e instanceof Error?e.message:'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        return defaultTheme;
      }
    }
  );

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/edd1edcc-d15d-43a6-9166-0f43d8e0a0e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeProvider.tsx:42',message:'ThemeProvider useEffect - applying theme',data:{theme},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/edd1edcc-d15d-43a6-9166-0f43d8e0a0e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeProvider.tsx:46',message:'System theme detected',data:{systemTheme},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/edd1edcc-d15d-43a6-9166-0f43d8e0a0e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeProvider.tsx:53',message:'setTheme called',data:{newTheme:theme,storageKey},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      try {
        localStorage.setItem(storageKey, theme);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/edd1edcc-d15d-43a6-9166-0f43d8e0a0e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeProvider.tsx:56',message:'Theme saved to localStorage',data:{theme},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
      } catch (e) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/edd1edcc-d15d-43a6-9166-0f43d8e0a0e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeProvider.tsx:59',message:'localStorage.setItem failed',data:{error:e instanceof Error?e.message:'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
      }
      setTheme(theme);
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

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
