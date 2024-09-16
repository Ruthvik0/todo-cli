import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { Category, DBFile, Todo, TodoPredicate } from "./types";
import { red } from "@colors/colors";
import { date } from "./utils";
import { dirname, join } from "node:path";
import { homedir } from "node:os";

const userHome = homedir();

const getDbFilePath = () => join(userHome, "todo-cli", "db.json");

// Ensure `db.json` exists in the application directory
export const ensureDbFileExists = () => {
  const dbFilePath = getDbFilePath();
  const dir = dirname(dbFilePath);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  if (!existsSync(dbFilePath)) {
    writeFileSync(
      dbFilePath,
      JSON.stringify(
        {
          todos: [],
          categories: [
            {
              id: 1,
              name: "personal",
            },
          ],
        },
        null,
        2
      )
    );
  }
};

const readFromDB = (): DBFile => {
  try {
    const data = readFileSync(getDbFilePath(), "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return { todos: [], categories: [] };
  }
};

export const writeToDB = (jsonData: DBFile): void => {
  try {
    writeFileSync(getDbFilePath(), JSON.stringify(jsonData, null, 2));
  } catch (err) {
    console.error(err);
  }
};

export const getTodos = (predicate?: TodoPredicate): Todo[] => {
  const db = readFromDB();
  if (predicate) {
    return db.todos.filter(predicate);
  }
  return db.todos;
};

export const getCategories = (): Category[] => {
  const db = readFromDB();
  return db.categories;
};

export const addTodo = (newTodo: Todo): void => {
  const db = readFromDB();
  newTodo.id = db.todos.length + 1;
  db.todos.push(newTodo);
  writeToDB(db);
};

export const deleteTodo = (taskId: number): void => {
  const db = readFromDB();
  db.todos = db.todos.filter((todo) => todo.id !== taskId);
  writeToDB(db);
};

export const completeTodo = (taskId: number): void => {
  const db = readFromDB();

  const todoToUpdate = db.todos.find((todo) => todo.id === taskId);

  if (!todoToUpdate) {
    console.log(red(`Todo with ID ${taskId} not found.`));
    process.exit(0);
  }

  todoToUpdate.completed = true;
  todoToUpdate.completedAt = date();
  writeToDB(db);
};
