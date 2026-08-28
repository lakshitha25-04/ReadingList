import { Book, ReadingEntry, User } from '../types';

export function getRecommendations(user: User | null, library: Book[], entries: Record<string, ReadingEntry>): Book[] {
  const finishedGenres = new Set(library.filter(book => entries[book.id]?.status === 'finished').map(book => book.genre));
  const preferred = new Set([user?.favouriteGenre, ...finishedGenres].filter(Boolean));
  return library.filter(book => preferred.has(book.genre) && entries[book.id]?.status !== 'to-read').slice(0, 6);
}
