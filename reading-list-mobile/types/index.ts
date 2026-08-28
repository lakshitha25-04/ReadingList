export type ReadingMode = 'adult' | 'kids';
export type ReadingStatus = 'to-read' | 'reading' | 'finished';

export interface ReadingEntry {
  status: ReadingStatus;
  currentPage: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  pages: number;
  description: string;
  cover: string;
  featured?: boolean;
  queued?: boolean;
}

export interface User {
  name: string;
  email: string;
  favouriteGenre: string;
  booksReadThisYear: number;
  streakDays: number;
  mode: ReadingMode;
}
