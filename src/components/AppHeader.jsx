// Importing necessary Material-UI components and icons.
import { Add } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { usePopupState } from "material-ui-popup-state/hooks";

// Importing the NewListDialog component.
import { NewListDialog } from "./NewListDialog.jsx";

// AppHeader component that provides the application header with a title and an add new list button.
export function AppHeader() {
  // Managing the state of the NewListDialog using material-ui-popup-state.
  const dialogState = usePopupState({ variant: "dialog", popupId: "new-list" });

  return (
    <>
      {/* Dialog for creating a new list */}
      <NewListDialog dialogState={dialogState} />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Lists
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="add new list"
            onClick={dialogState.open}
          >
            <Add />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
}
