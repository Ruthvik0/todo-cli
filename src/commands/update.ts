import { program } from "commander";
import { getTodos, writeToDB, getCategories } from "../dbRepository";
import { getTodosTable } from "../ui";
import { date, validateTask } from "../utils";
import { bgCyan, black, green, red } from "@colors/colors";
import {
  cancel,
  intro,
  outro,
  select,
  text,
  group,
  confirm,
} from "@clack/prompts";

export const updateCommand = program
  .command("update")
  .description("Update Todo by ID(s)")
  .option("-i, --id <number>", "ID of the todo to update")
  .option("-n, --name <string>", "New task name")
  .option("-c, --category <string>", "New category (optional)")
  .option("-d, --completed <boolean>", "Update completed status (optional)")
  .action(async (options) => {
    if (options.id) {
      const { id, name, category, completed } = options;

      if (!id || !name) {
        console.log(red("ID & name is required to update a todo."));
        process.exit(0);
      }

      const error = validateTask(name);
      if (typeof error === "string") {
        console.log(red(error));
        process.exit(0);
      }
      const idNumber: number = Number(id);
      if (isNaN(idNumber)) {
        console.log(red(`Invalid ID: ${id} is not a number.`));
        process.exit(0);
      }

      // Fetch the current list of todos
      const todos = getTodos();
      // Find the index of the todo to update
      const todoIndex = todos.findIndex((todo) => todo.id === idNumber);

      if (todoIndex === -1) {
        console.log(red(`Todo with ID ${idNumber} not found.`));
        process.exit(0);
      }

      const todoToUpdate = todos[todoIndex];

      // Update properties if provided

      todoToUpdate.task = name;

      if (category) {
        const categories = getCategories().map((c) => c.name.toLowerCase());
        if (!categories.includes(category.toLowerCase())) {
          console.log(red(`Category '${category}' does not exist.`));
          process.exit(0);
        }
        todoToUpdate.category = category;
      }

      if (completed !== undefined) {
        const completedStatus = completed.toLowerCase() === "true";
        todoToUpdate.completed = completedStatus;
        if (completedStatus) {
          todoToUpdate.completedAt = date(); // Set completion date if marking as completed
        } else {
          todoToUpdate.completedAt = null; // Clear completion date if marking as not completed
        }
      }

      // Save the updated todo list
      writeToDB({ todos, categories: getCategories() });

      console.log(green("Todo updated successfully"));
      console.log(getTodosTable(todos));
    } else {
      console.clear();

      intro(`${bgCyan(black("Update a todo"))}`);

      // Step 1: Select the todo to update
      const todos = getTodos();
      const choices = todos.map((todo) => ({
        value: todo.id,
        label: todo.task,
      }));

      if (choices.length === 0) {
        outro(red("There are no todos available for update."));
        process.exit(0);
      }

      const selectedId = await select({
        message: "Select the todo to update",
        options: choices,
      });

      const todoToUpdate = getTodos((todo) => todo.id === selectedId)[0];
      const updatedTodo = { ...todoToUpdate };

      const updateFields = await group(
        {
          name: () =>
            text({
              message: `New task name (previously "${todoToUpdate.task}")`,
              initialValue: todoToUpdate.task,
              validate: (value) => validateTask(value),
            }),
          category: () =>
            select({
              message: `New category (previously "${todoToUpdate.category}")`,
              initialValue: todoToUpdate?.category,
              options: getCategories().map((c) => ({
                label: c.name,
                value: c.name,
              })),
            }),
          completed: () =>
            confirm({
              message: `Mark as completed? (currently ${
                todoToUpdate.completed ? "completed" : "not completed"
              })`,
              initialValue: todoToUpdate.completed,
            }),
        },
        {
          onCancel: () => {
            cancel("Operation cancelled.");
            process.exit(0);
          },
        }
      );

      updatedTodo.task = updateFields.name;
      updatedTodo.category = updateFields.category;
      updatedTodo.completed = updateFields.completed;
      updatedTodo.completedAt = updateFields.completed ? date() : null;

      // Save the updated todo list
      const updatedTodos = todos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
      writeToDB({ todos: updatedTodos, categories: getCategories() });

      outro(green("Todo updated successfully"));
      console.log(getTodosTable(updatedTodos));
    }
  });
