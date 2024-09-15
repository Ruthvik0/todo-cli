import { Todo } from "./types";
import cliTable from "cli-table3";
import color from "@colors/colors";

export const getTodosTable = (todos: Todo[]): string => {
    const table = new cliTable({
      head: ["Id", "Task", "Category", "CreatedAt", "CompletedAt"].map((header) =>
        color.cyan(header)
      ),
    });
  
    todos.forEach((todo, index) => {
      const row = [
        index + "",
        todo.task,
        todo.category,
        todo.createdAt.toString(),
        todo.completedAt ? todo.completedAt.toString() : "",
      ];
      if (todo.completed) {
        row[1] = color.strikethrough(row[1]);
        table.push(row.map((cell) => color.green(cell)));
      } else {
        table.push(row);
      }
    });
  
    return table.toString();
  };