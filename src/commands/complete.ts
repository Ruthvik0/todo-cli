import { program } from "commander";
import { completeTodo, getTodos } from "../dbRepository";
import { getTodosTable } from "../ui";
import { bgCyan, black, green, red } from "@colors/colors";
import { intro, outro, multiselect } from "@clack/prompts";

export const completeCommand = program
  .command("complete")
  .description("Mark todos as complete by ID(s)")
  .option("-i, --id <numbers...>", "Mark todos with specified IDs as complete")
  .action(async (options) => {
    if (options.id) {
      const ids: number[] = options.id.map((value: string) => {
        const numberValue = Number(value);
        if (isNaN(numberValue)) {
          console.log(red(`Invalid ID: ${options.id} is not a number.`));
          process.exit(0);
        }
        return numberValue;
      });
      ids.forEach((index) => completeTodo(index));
      console.log(getTodosTable(getTodos()));
    } else {
      console.clear();

      intro(`${bgCyan(black("Complete todos"))}`);
      const choices = getTodos((todo) => todo.completed === false).map(
        (todo) => ({
          value: todo.id,
          label: todo.task,
        })
      );

      if (choices.length === 0) {
        outro(
          green("Wow! You deserve a break \n   All todos are completed")
        );
        process.exit(0);
      }

      const selectedIds = await multiselect({
        message: "Select todos to mark as done",
        options: choices,
      });

      const ids: number[] = selectedIds
        .toString()
        .split(",")
        .map((value) => Number.parseInt(value));
      ids.forEach((index) => completeTodo(index));

      outro(green("Todo's Updated Successfully"));
      console.log(getTodosTable(getTodos()));
    }
  });
