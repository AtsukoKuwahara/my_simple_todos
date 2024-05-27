// Importing necessary Material-UI components and icons.
import * as Icons from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import { useTodoLists } from "../hooks/useTodoLists.js";

// NewListDialog component to create a new todo list with a custom name and icon.
export function NewListDialog({ dialogState }) {
  const [state, setState] = useState(""); // Holds new list name
  const [iconSearch, setIconSearch] = useState(""); // Holds the search term for icon filtering
  const [icon, setIcon] = useState(""); // Holds the selected icon
  const { newList } = useTodoLists(); // Function to add a new list

  // State for filtered icons based on search
  const [filteredIcons, setFilteredIcons] = useState(Object.entries(Icons));

  // Filter icons based on search input
  useEffect(() => {
    setFilteredIcons(
      Object.entries(Icons)
        .filter(([name]) => !/Outlined$|TwoTone$|Rounded$|Sharp$/.test(name))
        .filter(([name]) =>
          iconSearch
            ? name.toLowerCase().includes(iconSearch.toLowerCase())
            : true
        )
        .slice(0, 10) // Increase or remove the limit based on UI capacity
    );
  }, [iconSearch]);

  // Reset form when dialog opens
  useEffect(() => {
    if (dialogState.isOpen) {
      setState("");
      setIconSearch("");
    }
  }, [dialogState.isOpen]);

  // Handle dialog close
  const handleClose = () => {
    setState("");
    setIconSearch("");
    dialogState.close();
  };

  return (
    <Dialog open={dialogState.isOpen} onClose={handleClose}>
      <DialogTitle>Create New List</DialogTitle>
      <DialogContent>
        <DialogContentText>Create a new list</DialogContentText>
        <TextField
          onChange={(event) => setState(event.target.value)}
          value={state}
          autoFocus
          margin="dense"
          id="name"
          label="New List Name"
          type="text"
          fullWidth
          variant="standard"
        />
        <TextField
          onChange={(event) => setIconSearch(event.target.value)}
          value={iconSearch}
          margin="dense"
          id="iconSearch"
          label="Icon Search"
          type="text"
          fullWidth
          variant="standard"
        />
        <Card
          variant="outlined"
          sx={{
            mt: 1,
            p: 1,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {filteredIcons.map(([name, Icon]) => (
            <Tooltip
              title={name.replace(/([A-Z])/g, " $1").trim()}
              key={name}
              placement="top"
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: 60, // Adjusted for better spacing
                  mx: 2,
                  my: 1,
                  alignItems: "center",
                }}
                key={name}
              >
                <ToggleButton
                  value={name}
                  selected={name === icon}
                  onClick={() => setIcon(name)}
                  sx={{ height: 50, width: 50 }}
                >
                  <Icon sx={{ fontSize: 24 }} />
                </ToggleButton>
                <Typography
                  variant="caption"
                  align="center"
                  sx={{
                    mt: 0.5,
                    maxWidth: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                  title={name.replace(/([A-Z])/g, " $1").trim()}
                >
                  {name.replace(/([A-Z])/g, " $1").trim()}
                </Typography>
              </Box>
            </Tooltip>
          ))}
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            newList(state, icon);
            handleClose();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
