import Dexie from "dexie";

// Initialize Dexie database
export const db = new Dexie("todo-list-db");

// Define database schema
db.version(3).stores({
  lists: "++id, name, orderIndex", // Add 'orderIndex' to track the order of lists
  listItems: "++id, name, checked, listId",
});

// API endpoints mapped to database actions
export const APIs = {
  TodoLists: "todo-lists",
  TodoListsUpdate: "todo-lists-update",
  TodoListsDelete: "todo-lists-delete",
  TodoListsSort: "todo-lists-sort",
  TodoList: "todo-list",
  TodoListDelete: "todo-list-delete",
  TodoListUpdate: "todo-list-update",
};

// Function to fetch data from the database
export async function fetcher({ url, ...variables }) {
  switch (url) {
    case APIs.TodoLists:
      return db.lists.orderBy("orderIndex").toArray();
    case APIs.TodoList:
      const list = await db.lists.get(variables.id);
      const items = await db.listItems
        .where({ listId: variables.id })
        .toArray();
      return { ...list, items };
    default:
      throw new Error(`Unknown API endpoint: ${url}`);
  }
}

// Function to handle database updates
export async function putter({ url, id, ...variables }) {
  switch (url) {
    case APIs.TodoLists:
      const count = await db.lists.count();
      return db.lists.add({
        name: variables.name,
        icon: variables.icon,
        orderIndex: count,
      });

    case APIs.TodoListsUpdate:
      return db.lists.update(id, { name: variables.name });

    case APIs.TodoListsDelete:
      await db.listItems.where({ listId: id }).delete();
      return db.lists.delete(id);

    case APIs.TodoListsSort:
      // Assuming variables.lists is an array of { id, orderIndex }
      return Promise.all(
        variables.lists.map(({ id, orderIndex }) =>
          db.lists.update(id, { orderIndex })
        )
      );

    case APIs.TodoList:
      return db.listItems.add({ listId: id, name: variables.name });

    case APIs.TodoListDelete:
      return db.listItems.delete(id);

    case APIs.TodoListUpdate:
      return db.listItems.update(id, variables);

    default:
      throw new Error(`Unsupported API operation: ${url}`);
  }
}
