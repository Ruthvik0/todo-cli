export type Todo = {
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
