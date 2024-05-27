import useSWR from "swr";
import { APIs, fetcher, putter } from "../utils.js";

// Custom hook to manage todo lists
export function useTodoLists() {
  const { data = [], mutate } = useSWR({ url: APIs.TodoLists }, fetcher);

  const newList = async (newListName, icon = "List") => {
    await mutate(
      async (oldData) => {
        const newList = await putter({
          url: APIs.TodoLists,
          icon,
          name: newListName,
        });
        return [...oldData, newList];
      },
      {
        populateCache: true,
        revalidate: true,
      }
    );
  };

  const updateList = async (listToUpdate, newListName) => {
    await mutate(
      async (oldData) => {
        await putter({
          url: APIs.TodoListsUpdate,
          id: listToUpdate,
          name: newListName,
        });
        return oldData.map((d) =>
          d.id === listToUpdate ? { ...d, name: newListName } : d
        );
      },
      {
        populateCache: true,
        revalidate: true,
      }
    );
  };

  const deleteList = async (listIdToDelete) => {
    await mutate(
      async (oldData) => {
        await putter({
          url: APIs.TodoListsDelete,
          id: listIdToDelete,
        });
        return oldData.filter((list) => list.id !== listIdToDelete);
      },
      {
        populateCache: true,
        revalidate: true,
      }
    );
  };

  const moveList = async (fromIndex, toIndex) => {
    await mutate(
      async (oldData) => {
        const newData = [...oldData];
        const [movedItem] = newData.splice(fromIndex, 1);
        newData.splice(toIndex, 0, movedItem);

        const sortedLists = newData.map((item, index) => ({
          id: item.id,
          orderIndex: index,
        }));

        await putter({
          url: APIs.TodoListsSort,
          lists: sortedLists,
        });

        return newData;
      },
      {
        populateCache: true,
        revalidate: true,
      }
    );
  };

  return { data, newList, updateList, deleteList, moveList };
}
