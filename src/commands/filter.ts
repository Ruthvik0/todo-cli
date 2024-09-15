import { program } from "commander";
import { Todo } from "../types";
import { getTodos } from "../dbRepository";
import { getTodosTable } from "../ui";

export const filterCommand = program
  .command("filter")
  .description("Filter todo's")
  .option("-t, --task <name>", "Filter by task name")
  .option("-c, --category <category>", "Filter by category")
  .option("-d, --done <boolean>", "Filter by it's status")
  .action((options) => {
    const filters: ((todo: Todo) => boolean)[] = [];

    if (options.task) {
      filters.push((todo) => todo.task.includes(options.task));
    }
    if (options.category) {
      filters.push((todo) => todo.category.includes(options.category));
    }
    if (options.done !== undefined) {
      const isDone = options.done.toLowerCase() === "true";
      filters.push((todo) => todo.completed === isDone);
    }
    // Combine filters into one predicate
    const predicate = (todo: Todo) => filters.every((filter) => filter(todo));
    // Call getTodos with the combined predicate
    const result = getTodos(predicate);
    console.log(getTodosTable(result));
  });