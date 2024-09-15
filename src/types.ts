export type Todo = {
  id : number | null;
  task: string;
  createdAt: Date;
  completedAt: Date | null;
  category: string;
  completed: Boolean;
};

export type Category = {
  name: string;
};

export type DBFile = {
  todos: Todo[];
  categories: Category[];
};

export type TodoPredicate = (todo: Todo) => boolean;