import color from "@colors/colors";
import { program } from "commander";
import { completeTodo, deleteTodo, getTodos } from "../dbRepository";
import { getTodosTable } from "../ui";
import * as p from "@clack/prompts";

export const completeCommand = program
  .command("complete")
  .description("Mark todos as complete by ID(s)")
  .option("-i, --id <numbers...>", "Mark todos with specified IDs as complete")
  .action(async (options) => {
    if (options.task) {
      const ids: number[] = options.id.map((value: string) => {
        const numberValue = Number(value);
        if (isNaN(numberValue)) {
          console.log(color.red(`Invalid ID: ${value} is not a number.`));
          process.exit(0);
        }
        return numberValue;
      });
      ids.forEach((index) => completeTodo(index));
      console.log(getTodosTable(getTodos()));
    } else {
      console.clear();

      p.intro(`${color.bgCyan(color.black("Complete todos"))}`);
      const choices = getTodos((todo) => todo.completed === false).map(
        (todo) => ({
          value: todo.id,
          label: todo.task,
        })
      );

      if (choices.length === 0) {
        p.outro(
          color.green("Wow! You deserve a break \n   All todos are completed")
        );
        process.exit(0);
      }

      const selectedIds = await p.multiselect({
        message: "Select todos to mark as done",
        options: choices,
      });

      const ids: number[] = selectedIds
        .toString()
        .split(",")
        .map((value) => Number.parseInt(value));
      ids.forEach((index) => completeTodo(index));

      p.outro(color.green("Todo's Updated Successfully"));
      console.log(getTodosTable(getTodos()));
    }
  });
