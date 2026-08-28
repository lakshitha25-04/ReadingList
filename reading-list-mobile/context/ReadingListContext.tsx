import { Alert } from 'react-native';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBooks, getGenres } from '../services/api';
import { getRecommendations } from '../services/recommendations';
import { readStorage, storageKeys, writeStorage } from '../services/storage';
import { RootState } from '../store';
import { hydrateGamification, recordFinished } from '../store/gamificationSlice';
import { addUploadedBook, hydrateLibrary, setCurrentPage, setStatus, toggleFavourite } from '../store/librarySlice';
import { Book, ReadingStatus } from '../types';
import { useUser } from './UserContext';

type ReadingListValue = { books: Book[]; genres: string[]; loading: boolean; error: string | null; retry: () => void; selectedGenre: string | null; setSelectedGenre: (genre: string | null) => void; searchText: string; setSearchText: (text: string) => void; recommendations: Book[]; addBook: (book: Book) => void; updateStatus: (id: string, status: ReadingStatus) => void; updatePage: (id: string, page: number) => void; toggleBookFavourite: (id: string) => void };
const ReadingListContext = createContext<ReadingListValue | undefined>(undefined);
export function ReadingListProvider({ children }: { children: ReactNode }) {
  const { user } = useUser(); const [books, setBooks] = useState<Book[]>([]); const [genres, setGenres] = useState<string[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); const [attempt, setAttempt] = useState(0); const [selectedGenre, setSelectedGenre] = useState<string | null>(null); const [searchText, setSearchTextState] = useState(''); const dispatch = useDispatch(); const library = useSelector((state: RootState) => state.library); const gamification = useSelector((state: RootState) => state.gamification); const seen = useRef(library.entries);
  useEffect(() => { const load = async () => { setLoading(true); setError(null); try { const [loadedBooks, loadedGenres] = await Promise.all([getBooks(), getGenres()]); setBooks(loadedBooks); setGenres(loadedGenres); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not load library.'); } finally { setLoading(false); } }; void load(); }, [attempt]);
  useEffect(() => { const hydrate = async () => { const [savedLibrary, savedGame, searches] = await Promise.all([readStorage(storageKeys.queue, library), readStorage(storageKeys.badges, gamification), readStorage<string[]>(storageKeys.searches, [])]); dispatch(hydrateLibrary(savedLibrary)); dispatch(hydrateGamification(savedGame)); if (searches.length) setSearchTextState(searches[0]); }; void hydrate(); }, [dispatch]);
  useEffect(() => { void writeStorage(storageKeys.queue, library, 'Queue saved'); }, [library]);
  useEffect(() => { void writeStorage(storageKeys.badges, gamification, 'Gamification saved'); }, [gamification]);
  useEffect(() => { Object.entries(library.entries).forEach(([id, entry]) => { const previous = seen.current[id]; if (previous && previous.status !== entry.status) { console.log(`Reading queue update: ${id} is now ${entry.status}`); if (entry.status === 'finished') { dispatch(recordFinished(new Date().toISOString().slice(0, 10))); Alert.alert('Great work!', 'Book finished! Your streak and badges have been updated.'); } } }); seen.current = library.entries; }, [library.entries, dispatch]);
  const setSearchText = (text: string) => { setSearchTextState(text); if (text.trim()) void writeStorage(storageKeys.searches, [text].slice(0, 5), 'Search saved'); };
  const allBooks = [...books, ...library.uploadedBooks];
  const addBook = (book: Book) => { dispatch(addUploadedBook(book)); Alert.alert('Book saved', `${book.title} was added to your library.`); };
  return <ReadingListContext.Provider value={{ books: allBooks, genres, loading, error, retry: () => setAttempt(current => current + 1), selectedGenre, setSelectedGenre, searchText, setSearchText, recommendations: getRecommendations(user, allBooks, library.entries), addBook, updateStatus: (id, status) => dispatch(setStatus({ id, status })), updatePage: (id, page) => dispatch(setCurrentPage({ id, currentPage: page })), toggleBookFavourite: id => dispatch(toggleFavourite(id)) }}>{children}</ReadingListContext.Provider>;
}
export function useReadingList() { const value = useContext(ReadingListContext); if (!value) throw new Error('useReadingList must be used within ReadingListProvider'); return value; }
