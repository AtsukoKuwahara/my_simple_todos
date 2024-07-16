import useSWR from "swr";
import { APIs, fetcher, putter } from "../utils.js";

// Custom hook to manage operations on individual todo lists
export function useTodoList(currentList) {
  // Fetch the data for the current list using SWR
  const { data, mutate } = useSWR(
    () => currentList && { url: APIs.TodoList, id: currentList },
    fetcher
  );

  // Function to add a new item to the current list
  const newItem = async (newItemName) => {
    const newItemData = {
      name: newItemName,
      checked: false,
      id: crypto.randomUUID(),
    };
    await mutate(
      await putter({ url: APIs.TodoList, id: currentList, name: newItemName }),
      {
        populateCache: false,
        optimisticData: (oldData) => ({
          ...oldData,
          items: [...oldData.items, newItemData],
        }),
      }
    );
  };

  // Function to delete an item from the current list
  const deleteItem = async (itemToDelete) => {
    await mutate(await putter({ url: APIs.TodoListDelete, id: itemToDelete }), {
      populateCache: false,
      optimisticData: (oldData) => ({
        ...oldData,
        items: oldData.items.filter(({ id }) => id !== itemToDelete),
      }),
    });
  };

  // Function to toggle the checked status of an item
  const toggleChecked = async (itemToToggle) => {
    const targetItem = data.items.find(({ id }) => id === itemToToggle);
    await mutate(
      await putter({
        url: APIs.TodoListUpdate,
        id: itemToToggle,
        checked: !targetItem.checked,
      }),
      {
        populateCache: false,
        optimisticData: (oldData) => ({
          ...oldData,
          items: oldData.items.map((item) =>
            item.id === itemToToggle
              ? { ...item, checked: !item.checked }
              : item
          ),
        }),
      }
    );
  };

  // Function to update the name of an item
  const updateItem = async (itemToUpdate, newItemName) => {
    await mutate(
      await putter({
        url: APIs.TodoListUpdate,
        id: itemToUpdate,
        name: newItemName,
      }),
      {
        populateCache: false,
        optimisticData: (oldData) => ({
          ...oldData,
          items: oldData.items.map((item) =>
            item.id === itemToUpdate ? { ...item, name: newItemName } : item
          ),
        }),
      }
    );
  };

  // Check if all items are checked and there are items in the list
const allChecked = data?.items.length > 0 && data.items.every((item) => item.checked);

return { data, newItem, deleteItem, toggleChecked, updateItem, allChecked };
}
