// Importing necessary Material-UI components for layout and CSS baseline.
import { Box, CssBaseline } from "@mui/material";

// Importing the AppState provider for managing global state across the application.
import { AppState } from "../providers/AppState.jsx";

// Importing main UI components of the application.
import { AllTodoLists } from "./AllTodoLists.jsx";
import { AppHeader } from "./AppHeader.jsx";
import { CurrentTodoList } from "./CurrentTodoList.jsx";

// App component that orchestrates the layout and state management of the todo application.
export default function App() {
  return (
    <AppState>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppHeader />
        <AllTodoLists />
        <CurrentTodoList />
      </Box>
    </AppState>
  );
}
