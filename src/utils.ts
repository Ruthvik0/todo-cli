import dayjs from "dayjs";

export const validateTask = (task: string): string | void => {
  if (!task) return "Please enter a task name.";
  if (task.length < 3) return "Task name should be at least 3 characters";
};

export const date = () : string => {
  return dayjs().format("DD-MM-YYYY HH:mm");
}