import { createContext, useContext, useMemo, useState } from "react";

// Create context with default values
const AppStateContext = createContext({
  currentList: null,
  setCurrentList: () => {}, // Default function to avoid errors when calling
});

// Context provider component
export function AppState({ children }) {
  const [currentList, setCurrentList] = useState(null); // State to track the currently active list

  // Memoize context value to optimize performance and avoid unnecessary re-renders
  const value = useMemo(
    () => ({
      currentList,
      setCurrentList,
    }),
    [currentList]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

// Custom hook to use the AppStateContext
export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }

  return context;
}
