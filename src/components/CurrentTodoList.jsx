// Importing necessary Material-UI components and icons.
import * as Icons from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { DeleteOutlineRounded, Send } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useTodoList } from "../hooks/useTodoList.js";
import { useTodoLists } from "../hooks/useTodoLists.js";
import { useAppState } from "../providers/AppState.jsx";
import "./styles.css"; // Ensure this imports the CSS with the congrats animation

// CurrentTodoList component to display and manage the items of the selected todo list.
export function CurrentTodoList() {
  // Fetching current list ID from global state
  const { currentList } = useAppState();
  // Fetching data and actions for the current todo list
  const { data, newItem, deleteItem, toggleChecked, updateItem, allChecked } =
    useTodoList(currentList);
  // Fetching the function to update the list name
  const { updateList } = useTodoLists();

  // Local state to manage new item text and original list details
  const [newItemText, setNewItemText] = useState("");
  const [originalListName, setOriginalListName] = useState("");
  const [originalListItems, setOriginalListItems] = useState({});

  // Update the list name in local state when data changes
  useEffect(() => {
    if (data?.name) setOriginalListName(data.name);
  }, [currentList, data?.name]);

  // Update the list items in local state when data changes
  useEffect(() => {
    if (data?.items) {
      setOriginalListItems(
        data.items.reduce((acc, { id, name }) => ({ ...acc, [id]: name }), {})
      );
    }
  }, [data]);

  // Determine the icon for the current list
  const Icon = Icons[data?.icon];

  // Handle submission of new item
  const handleSubmit = (event) => {
    event.preventDefault();
    newItem(newItemText);
    setNewItemText("");
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Box sx={{ flex: 1 }}>
        {data ? (
          <>
            {/* Display the current list name and icon */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  p: 1,
                  mr: 1,
                  borderRadius: "50%",
                  display: "flex",
                }}
              >
                {Icon ? (
                  <Icon fontSize="large" />
                ) : (
                  <Icons.List fontSize="large" />
                )}
              </Box>
              <TextField
                value={originalListName}
                onChange={(e) => setOriginalListName(e.target.value)}
                onBlur={(e) => updateList(data.id, e.target.value)}
              />
            </Box>
            <Divider />
            {/* Display the items in the current list */}
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                mx: "auto",
                mt: 2,
              }}
            >
              {data.items.map(({ id, checked }) => (
                <ListItem
                  key={id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteItem(id)}
                    >
                      <DeleteOutlineRounded />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton
                    role={undefined}
                    onClick={() => toggleChecked(id)}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{
                          "aria-labelledby": `checkbox-list-label-${id}`,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText id={`checkbox-list-label-${id}`}>
                      <TextField
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          setOriginalListItems({
                            ...originalListItems,
                            [id]: e.target.value,
                          })
                        }
                        onBlur={(e) => updateItem(id, e.target.value)}
                        value={originalListItems[id] ?? ""}
                        size="small"
                        variant="standard"
                      />
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
              {/* Input for adding new items */}
              <ListItem>
                <Box component="form" sx={{ width: 1 }} onSubmit={handleSubmit}>
                  <TextField
                    onChange={(e) => setNewItemText(e.target.value)}
                    value={newItemText}
                    margin="normal"
                    id="new-item"
                    label="New Item"
                    type="text"
                    fullWidth
                    variant="filled"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="submit"
                            onClick={handleSubmit}
                            edge="end"
                            type="submit"
                          >
                            <Send />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </ListItem>
            </List>
            {/* Display congratulations message if all items are checked */}
            {allChecked && <div className="congrats">Congratulations!</div>}
          </>
        ) : (
          <Typography>No List Selected</Typography>
        )}
      </Box>
    </Box>
  );
}
