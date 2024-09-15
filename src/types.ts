export type Todo = {
  id : number | null;
  task: string;
  createdAt: string;
  completedAt: string | null;
  category: string;
  completed: boolean;
};

export type Category = {
  name: string;
};

export type DBFile = {
  todos: Todo[];
  categories: Category[];
};

export type TodoPredicate = (todo: Todo) => boolean;