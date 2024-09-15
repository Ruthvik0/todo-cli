import color from "@colors/colors";
import { program } from "commander";
import { deleteTodo, getTodos } from "../dbRepository";
import { getTodosTable } from "../ui";
import * as p from "@clack/prompts";

export const deleteCommand = program
  .command("delete")
  .description("Delete todos of index")
  .option("-i, --id <numbers...>", "Delete todos with specified IDs")
  .action(async (options) => {
    if (options.task) {
      const ids: number[] = options.id.map((value: string) => {
        const numberValue = Number(value);
        if (isNaN(numberValue)) {
          console.log(`${color.red(`Invalid ID: ${value} is not a number.`)}`);
          process.exit(0);
        }
        return numberValue;
      });
      ids.forEach((index) => deleteTodo(index));
      console.log(getTodosTable(getTodos()));
    } else {
      console.clear();

      p.intro(`${color.bgCyan(color.black("Delete todos"))}`);
      const choices = getTodos().map((todo) => ({
        value: todo.id,
        label: todo.task,
      }));

      const selectedIds = await p.multiselect({
        message: "Select todos to delete",
        options: choices,
      });

      const ids: number[] = selectedIds
        .toString()
        .split(",")
        .map((value) => Number.parseInt(value));
      ids.forEach((index) => deleteTodo(index));

      p.outro(color.green("Todo's Deleted Successfully"));
      console.log(getTodosTable(getTodos()));
    }
  });
