import { Command } from "commander";
import {getTodos } from "./dbRepository";
import { getTodosTable } from "./ui";
import { addCommand } from "./commands/add";
import { filterCommand } from "./commands/filter";
import { deleteCommand } from "./commands/delete";

const program = new Command("Todo");

program
  .name("Todo-cli")
  .description("Manage your Todo's from CLI")
  .action(() => {
    console.log(getTodosTable(getTodos()));
  });

program.addCommand(addCommand)
program.addCommand(filterCommand)
program.addCommand(deleteCommand)

program.parse(process.argv);