import fs from "node:fs";
import { Category, DBFile, Todo, TodoPredicate } from "./types";
import color from "@colors/colors";

const dbFilePath: string = "./src/db.json";

const readFromDB = (): DBFile => {
  try {
    const data = fs.readFileSync(dbFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return { todos: [], categories: [] };
  }
};

const writeToDB = (jsonData: DBFile): void => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(jsonData, null, 2));
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
  newTodo.id = db.todos.length;
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
  todoToUpdate.completedAt = new Date();
  writeToDB(db);
};
