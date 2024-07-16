// Importing necessary Material-UI components and icons.
import * as Icons from "@mui/icons-material";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

import { useState, useEffect } from "react";
import { useTodoLists } from "../hooks/useTodoLists.js";
import { useAppState } from "../providers/AppState.jsx";
import "./styles.css";

// AllTodoLists component to display and manage all todo lists.
export function AllTodoLists() {
  const { data, deleteList, moveList } = useTodoLists();
  const { currentList, setCurrentList } = useAppState();

  // Set the first list as the current list if none is selected.
  useEffect(() => {
    if (!currentList && data.length > 0) {
      setCurrentList(data[0]?.id);
    }
  }, [currentList, data, setCurrentList]);

  // State for managing the delete confirmation dialog.
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedListId, setSelectedListId] = useState(null);

  // Open the delete confirmation dialog.
  const handleOpenDialog = (id) => {
    setSelectedListId(id);
    setOpenDialog(true);
  };

  // Close the delete confirmation dialog.
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Confirm the deletion of a list.
  const confirmDelete = () => {
    deleteList(selectedListId);
    setOpenDialog(false);
  };

  // Handle moving a list up in the order.
  const handleMoveUp = async (index) => {
    if (index > 0) {
      await moveList(index, index - 1);
    }
  };

  // Handle moving a list down in the order.
  const handleMoveDown = async (index) => {
    if (index < data.length - 1) {
      await moveList(index, index + 1);
    }
  };

  return (
    <Drawer
      sx={{
        width: 0.35,
        minWidth: 200,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 0.35,
          minWidth: 200,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <List>
        {data.map(({ name, id, icon }, index) => {
          const Icon = Icons[icon] || Icons.List;
          return (
            <ListItem key={id} disablePadding>
              <ListItemButton
                onClick={() => setCurrentList(id)}
                selected={currentList === id}
              >
                <Icon />
                <ListItemText 
                  sx={{ ml: 0.5 }} 
                  primary={<span className="overflow-ellipsis">{name}</span>}
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "4px",
                  }}
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveUp(index);
                    }}
                    disabled={index === 0}
                    color="primary"
                    size="large"
                  >
                    <ArrowCircleUpIcon />
                  </IconButton>

                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveDown(index);
                    }}
                    disabled={index === data.length - 1}
                    color="primary"
                    size="large"
                  >
                    <ArrowCircleDownIcon />
                  </IconButton>

                  <Tooltip title="Delete">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(id);
                      }}
                      edge="end"
                      aria-label="delete"
                      size="large"
                      color="secondary"
                    >
                      <DeleteForeverOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Dialog for confirming deletion of a list */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this list? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}
