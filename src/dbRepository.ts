import fs from "node:fs";
import { Category, DBFile, Todo, TodoPredicate } from "./types";
import color from "@colors/colors";
import { date } from "./utils";
import path from "node:path";
import os from "node:os";

const userHome = os.homedir();

const getDbFilePath = () => path.join(userHome, "todo-cli", "db.json");

// Ensure `db.json` exists in the application directory
export const ensureDbFileExists = () => {
  const dbFilePath = getDbFilePath();
  const dir = path.dirname(dbFilePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(
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
    const data = fs.readFileSync(getDbFilePath(), "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return { todos: [], categories: [] };
  }
};

export const writeToDB = (jsonData: DBFile): void => {
  try {
    fs.writeFileSync(getDbFilePath(), JSON.stringify(jsonData, null, 2));
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
    console.log(color.red(`Todo with ID ${taskId} not found.`));
    process.exit(0);
  }

  todoToUpdate.completed = true;
  todoToUpdate.completedAt = date();
  writeToDB(db);
};
