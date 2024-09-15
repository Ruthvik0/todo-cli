import { program } from "commander";
import { Todo } from "../types";
import { addTodo, getCategories, getTodos } from "../dbRepository";
import color from "@colors/colors";
import * as p from "@clack/prompts";
import { getTodosTable } from "../ui";
import { date, validateTask } from "../utils";

export const addCommand = program
  .command("add")
  .description("Add new todo")
  .option("-t, --task <string>", "task description")
  .option("-c, --category <string>", "category type", "personal")
  .action(async (options) => {
    if (options.task && options.category) {
      const error = validateTask(options.task);
      if (typeof error === "string") {
        console.log(color.red(error));
        process.exit(0);
      }

      if (
        !getCategories()
          .map((c) => c.name.toLowerCase())
          .includes(options.category)
      ) {
        console.log(color.red(`There is no category as ${options.category}`));
        process.exit(0);
      }

      const newTodo: Todo = {
        id: null,
        task: options.task,
        category: options.category,
        createdAt: date(),
        completedAt: null,
        completed: false,
      };
      addTodo(newTodo);

      console.log(color.green("Todo Added Successfully"));
      console.log(getTodosTable(getTodos()));
    } else {
      console.clear();

      p.intro(`${color.bgCyan(color.black("Add new todo"))}`);

      const todo = await p.group(
        {
          task: () =>
            p.text({
              message: "What are you planning?",
              placeholder: "Go get milk",
              validate: (value) => validateTask(value),
            }),
          category: () =>
            p.select({
              message: "What would be the category?",
              initialValue: "personal",
              options: getCategories().map((c) => ({
                label: c.name,
                value: c.name.toLowerCase(),
              })),
            }),
        },
        {
          onCancel: () => {
            p.cancel("Operation cancelled.");
            process.exit(0);
          },
        }
      );

      const newTodo: Todo = {
        id: null,
        task: todo.task,
        category: todo.category,
        createdAt: date(),
        completedAt: null,
        completed: false,
      };

      addTodo(newTodo);

      p.outro(color.green("Todo Added Successfully"));
      console.log(getTodosTable(getTodos()));
    }
  });
