// dbRepository.ts

import fs from 'node:fs';
import { Category, DBFile, Todo } from './types';

const dbFilePath: string = "./src/db.json";

const readFromDB = (): DBFile => {
  try {
    const data = fs.readFileSync(dbFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return { todos: [], categories: [] }; // Return empty data on error
  }
};

const writeToDB = (jsonData: DBFile): void => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(jsonData, null, 2));
  } catch (err) {
    console.error(err);
  }
};

export const getTodos = (): Todo[] => {
  const db = readFromDB();
  return db.todos;
};

export const getCategories = (): Category[] => {
    const db = readFromDB();
    return db.categories;
  };

export const addTodo = (newTodo: Todo): void => {
  const db = readFromDB();
  db.todos.push(newTodo);
  writeToDB(db);
};

export const deleteTodo = (taskId: string): void => {
  const db = readFromDB();
  db.todos = db.todos.filter(todo => todo.task !== taskId);
  writeToDB(db);
};
