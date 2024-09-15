import { program } from "commander";
import { Todo } from "../types";
import { addTodo, getCategories, getTodos } from "../dbRepository";
import color from "@colors/colors";
import { setTimeout } from "node:timers/promises";
import * as p from "@clack/prompts";
import { getTodosTable } from "../ui";

export const addCommand = program
  .command("add")
  .description("Add new todo")
  .option("-t, --task <name>", "task description")
  .option("-c, --category <category>", "category type", "personal")
  .action(async (options) => {
    if (options.task && options.category) {
      const newTodo: Todo = {
        id: null,
        task: options.task,
        category: options.category,
        createdAt: new Date(),
        completedAt: null,
        completed: false,
      };
      addTodo(newTodo);

      console.log(color.green("Todo Added Successfully"));
      console.log(getTodosTable(getTodos()));
    } else {
      console.clear();
      await setTimeout(1000);

      p.intro(`${color.bgCyan(color.black("Add new todo"))}`);

      const todo = await p.group(
        {
          task: () =>
            p.text({
              message: "What are you planning?",
              placeholder: "Go get milk",
              validate: (value) => {
                if (!value) return "Please enter a task name.";
                if (value.length < 3)
                  return "Task name should be at least 3 characters";
              },
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
        createdAt: new Date(),
        completedAt: null,
        completed: false,
      };

      addTodo(newTodo);

      p.outro(color.green("Todo Added Successfully"));
      console.log(getTodosTable(getTodos()));
    }
  });
