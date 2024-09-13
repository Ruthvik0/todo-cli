import { input, select, Separator } from "@inquirer/prompts";
import { Command } from "commander";
import fs from "node:fs";

type Todo = {
  task: String;
  createdAt: Date;
  completedAt: Date | null;
  category: String;
};

type Category = {
  name: String;
};

type DBFile = {
  todos: Todo[];
  categories: Category[];
};

const dbFilePath: string = "./src/db.json";

let todoList: Todo[] = [];
let categoryList: Category[] = [];

try {
  const data = fs.readFileSync(dbFilePath, "utf8");
  const db = JSON.parse(data);
  todoList = db.todos;
  categoryList = db.categories;
} catch (err) {
  console.error(err);
}

const writeToDBJSON = (jsonData: DBFile): void => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(jsonData, null, 2));
  } catch (err) {
    console.error(err);
  }
};

const program = new Command("Todo");

program
  .name("Todo-cli")
  .description("Manage your Todo's from CLI")
  .action(() => {
    console.log(todoList);
  });

program
  .command("add")
  .description("Add new todo")
  .option("-t, --task <name>", "task description")
  .option("-c --category <category>", "category type", "personal")
  .action(async (options) => {
    if (options.task && options.category) {
      todoList.push({
        task: options.task,
        category: options.category,
        createdAt: new Date(),
        completedAt: null,
      });
      const jsonData: DBFile = { todos: todoList, categories: categoryList };
      writeToDBJSON(jsonData);
    } else {
      const task: string = await input({ message: "What are you planning?" });
      const categoryChoices: any = categoryList.map(
        (c) => ({ name: c.name, value: c.name.toLowerCase() }),
        new Separator()
      );
      const category: string = await select({
        message: "What would be the category?",
        choices: categoryChoices,
      });
      todoList.push({
        task,
        category,
        createdAt: new Date(),
        completedAt: null,
      });
      const jsonData: DBFile = { todos: todoList, categories: categoryList };
      writeToDBJSON(jsonData);
    }
  });

program.parse(process.argv);
