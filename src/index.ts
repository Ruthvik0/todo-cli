#!/usr/bin/env node
import { Command } from "commander";
import {ensureDbFileExists, getTodos } from "./dbRepository";
import { getTodosTable } from "./ui";
import { addCommand } from "./commands/add";
import { filterCommand } from "./commands/filter";
import { deleteCommand } from "./commands/delete";
import { completeCommand } from "./commands/complete";
import { updateCommand } from "./commands/update";

ensureDbFileExists()

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
program.addCommand(completeCommand)
program.addCommand(updateCommand)

program.parse(process.argv);