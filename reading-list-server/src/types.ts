export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  pages: number;
  featured?: boolean;
  queued?: boolean;
  description: string;
  cover?: string;
  file?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  favouriteGenre: string;
  booksReadThisYear: number;
  streakDays: number;
  mode: "adult" | "kids";
  parentId?: string;
  childIds?: string[];
};

export type ReadingListItem = {
  id: string;
  userId: string;
  bookId: string;
  status: "want-to-read" | "reading" | "finished";
  progress: number;
  addedAt: string;
  finishedAt?: string;
};

export type Review = { id: string; bookId: string; userId: string; rating: number; comment: string; createdAt: string };
