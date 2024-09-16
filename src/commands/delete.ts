import { program } from "commander";
import { deleteTodo, getTodos } from "../dbRepository";
import { getTodosTable } from "../ui";
import { bgCyan, black, green, red } from "@colors/colors";
import { intro, outro, multiselect } from "@clack/prompts";

export const deleteCommand = program
  .command("delete")
  .description("Delete todos of index")
  .option("-i, --id <numbers...>", "Delete todos with specified IDs")
  .action(async (options) => {
    if (options.task) {
      const ids: number[] = options.id.map((value: string) => {
        const numberValue = Number(value);
        if (isNaN(numberValue)) {
          console.log(red(`Invalid ID: ${value} is not a number.`));
          process.exit(0);
        }
        return numberValue;
      });
      ids.forEach((index) => deleteTodo(index));
      console.log(getTodosTable(getTodos()));
    } else {
      console.clear();

      intro(`${bgCyan(black("Delete todos"))}`);
      const choices = getTodos().map((todo) => ({
        value: todo.id,
        label: todo.task,
      }));

      if (choices.length === 0) {
        console.log(red("There are no todos"));
        process.exit(0);
      }

      const selectedIds = await multiselect({
        message: "Select todos to delete",
        options: choices,
      });

      const ids: number[] = selectedIds
        .toString()
        .split(",")
        .map((value) => Number.parseInt(value));
      ids.forEach((index) => deleteTodo(index));

      outro(green("Todo's Deleted Successfully"));
      console.log(getTodosTable(getTodos()));
    }
  });
