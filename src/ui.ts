import { Todo } from "./types";
import cliTable from "cli-table3";
import {cyan, green, strikethrough} from "@colors/colors";

export const getTodosTable = (todos: Todo[]): string => {
  const table = new cliTable({
    head: ["Id", "Task", "Category", "CreatedAt", "CompletedAt"].map((header) =>
      cyan(header)
    ),
  });

  todos.forEach((todo) => {
    const row = [
      todo.id + "",
      todo.task,
      todo.category,
      todo.createdAt.toString(),
      todo.completedAt ? todo.completedAt.toString() : "",
    ];
    if (todo.completed) {
      row[1] = strikethrough(row[1]);
      table.push(row.map((cell) => green(cell)));
    } else {
      table.push(row);
    }
  });

  return table.toString();
};
