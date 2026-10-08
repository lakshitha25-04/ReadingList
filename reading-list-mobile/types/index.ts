export type ReadingMode = 'adult' | 'kids';
export type ReadingStatus = 'to-read' | 'reading' | 'finished';

export interface ReadingEntry {
  status: ReadingStatus;
  currentPage: number;
  lastProgressUpdatedAt?: string;
}

export const BOOK_MOODS = ['Cozy', 'Thrilling', 'Emotional', 'Light-read', 'Inspiring', 'Dark'] as const;
export type BookMood = typeof BOOK_MOODS[number];

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
  mood?: BookMood;
  external?: boolean;
}

export interface User {
  name: string;
  email: string;
  favouriteGenre: string;
  booksReadThisYear: number;
  streakDays: number;
  readingGoal: number;
  mode: ReadingMode;
}
