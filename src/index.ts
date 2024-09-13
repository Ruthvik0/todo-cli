import { input } from "@inquirer/prompts";
import { Command } from "commander";

type Todo = {
  task: String;
  createdAt: Date;
  completedAt: Date | null;
  category: String;
};

type Category = {
  name: String;
};

const todoList: Todo[] = [];
const categoryList: Category[] = [];

const program = new Command("Todo");

program
  .name("Todo-cli")
  .description("Manage your Todo's from CLI")
  .action(() => {
    console.log("Hello");
  });

program
  .command("add")
  .description("Add new todo")
  .action(async () => {
    const answer = await input({ message: "What are you planning?" });
    console.log(answer);
  });

program.parse(process.argv);