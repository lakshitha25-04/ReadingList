import { Alert } from 'react-native';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBooks, getFeatured, getGenres, getGoogleBooksRecommendations } from '../services/api';
import { getRecommendations } from '../services/recommendations';
import { readStorage, storageKeys, writeStorage } from '../services/storage';
import { RootState } from '../store';
import { hydrateGamification, recordFinished, recordPagesRead } from '../store/gamificationSlice';
import { addUploadedBook, hydrateLibrary, setCurrentPage, setMood, setStatus, toggleFavourite } from '../store/librarySlice';
import { Book, BookMood, ReadingStatus } from '../types';
import { useUser } from './UserContext';
import { KidsCelebration } from '../components/KidsCelebration';

type ReadingListValue = { books: Book[]; genres: string[]; loading: boolean; refreshing: boolean; error: string | null; offline: boolean; lastSynced: string | null; retry: () => void; refresh: () => Promise<void>; dismissOffline: () => void; clearCachedApiData: () => Promise<void>; selectedGenre: string | null; setSelectedGenre: (genre: string | null) => void; selectedMood: BookMood | null; setSelectedMood: (mood: BookMood | null) => void; searchText: string; setSearchText: (text: string) => void; recommendations: Book[]; googleRecommendations: Book[]; addBook: (book: Book) => void; addExternalBook: (book: Book) => void; updateMood: (id: string, mood: BookMood) => void; updateStatus: (id: string, status: ReadingStatus) => void; updatePage: (id: string, page: number) => void; toggleBookFavourite: (id: string) => void };
const ReadingListContext = createContext<ReadingListValue | undefined>(undefined);

export function ReadingListProvider({ children }: { children: ReactNode }) {
  const { user, mode } = useUser(); const [books, setBooks] = useState<Book[]>([]); const [genres, setGenres] = useState<string[]>([]); const [loading, setLoading] = useState(true); const [refreshing, setRefreshing] = useState(false); const [error, setError] = useState<string | null>(null); const [offline, setOffline] = useState(false); const [lastSynced, setLastSynced] = useState<string | null>(null); const [selectedGenre, setSelectedGenre] = useState<string | null>(null); const [selectedMood, setSelectedMood] = useState<BookMood | null>(null); const [searchText, setSearchTextState] = useState(''); const [googleRecommendations, setGoogleRecommendations] = useState<Book[]>([]); const [showKidsCelebration, setShowKidsCelebration] = useState(false); const dispatch = useDispatch(); const library = useSelector((state: RootState) => state.library); const gamification = useSelector((state: RootState) => state.gamification); const safeEntries = library?.entries && typeof library.entries === 'object' ? library.entries : {}; const safeUploadedBooks = Array.isArray(library?.uploadedBooks) ? library.uploadedBooks : []; const safeMoods = library?.moods && typeof library.moods === 'object' ? library.moods : {}; const safeFavourites = Array.isArray(library?.favourites) ? library.favourites : []; const safeLibrary = { entries: safeEntries, uploadedBooks: safeUploadedBooks, moods: safeMoods, favourites: safeFavourites }; const safeGamification = { streak: Number(gamification?.streak) || 0, totalFinished: Number(gamification?.totalFinished) || 0, earnedBadges: Array.isArray(gamification?.earnedBadges) ? gamification.earnedBadges : [], weeklyPagesRead: Number(gamification?.weeklyPagesRead) || 0, weeklyResetAt: typeof gamification?.weeklyResetAt === 'string' ? gamification.weeklyResetAt : new Date(Date.now() + 7 * 86400000).toISOString(), ...(gamification?.lastFinishedDate ? { lastFinishedDate: gamification.lastFinishedDate } : {}) }; const seen = useRef(safeEntries);
  const load = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const [loadedBooks, loadedGenres] = await Promise.all([getBooks(), getGenres()]);
      const syncedAt = new Date().toISOString();
      setBooks(loadedBooks);
      setGenres(loadedGenres);
      setLastSynced(syncedAt);
      setOffline(false);
      await Promise.all([
        writeStorage(storageKeys.apiBooks, loadedBooks, 'Books cached'),
        writeStorage(storageKeys.apiGenres, loadedGenres, 'Genres cached'),
        writeStorage(storageKeys.apiLastSynced, syncedAt, 'API sync saved'),
      ]);
      // Featured data is optional; it must not keep the library spinner active.
      void getFeatured()
        .then(featured => writeStorage(storageKeys.apiFeatured, featured, 'Featured books cached'))
        .catch(cause => console.log('[ReadingList] Featured fetch failed; main library fetch succeeded.', cause));
    } catch (cause) {
      console.log('[ReadingList] Books/genres fetch failed; attempting cached offline data.', cause);
      const [cachedBooks, cachedGenres, cachedSynced] = await Promise.all([
        readStorage<Book[]>(storageKeys.apiBooks, []),
        readStorage<string[]>(storageKeys.apiGenres, []),
        readStorage<string | null>(storageKeys.apiLastSynced, null),
      ]);
      if (cachedBooks.length || cachedGenres.length) {
        setBooks(cachedBooks);
        setGenres(cachedGenres);
        setLastSynced(cachedSynced);
        setOffline(true);
        console.log('[ReadingList] Offline cache loaded; offline flag set to true.');
      } else {
        setOffline(false);
        console.log('[ReadingList] No cached library data; offline flag remains false.');
        setError(cause instanceof Error ? cause.message : 'Could not load library.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => { void load(); }, []);
  useEffect(() => { const hydrate = async () => { const [savedLibrary, savedGame, searches] = await Promise.all([readStorage<unknown>(storageKeys.queue, null), readStorage<unknown>(storageKeys.badges, null), readStorage<unknown>(storageKeys.searches, [])]); const storedLibrary = savedLibrary && typeof savedLibrary === 'object' ? savedLibrary as Partial<typeof safeLibrary> : {}; const storedGame = savedGame && typeof savedGame === 'object' ? savedGame as Partial<typeof safeGamification> : {}; dispatch(hydrateLibrary({ entries: storedLibrary.entries && typeof storedLibrary.entries === 'object' ? storedLibrary.entries : safeEntries, favourites: Array.isArray(storedLibrary.favourites) ? storedLibrary.favourites : safeFavourites, uploadedBooks: Array.isArray(storedLibrary.uploadedBooks) ? storedLibrary.uploadedBooks : safeUploadedBooks, moods: storedLibrary.moods && typeof storedLibrary.moods === 'object' ? storedLibrary.moods : {} })); dispatch(hydrateGamification({ ...safeGamification, ...storedGame, earnedBadges: Array.isArray(storedGame.earnedBadges) ? storedGame.earnedBadges : [], weeklyPagesRead: Number(storedGame.weeklyPagesRead) || 0, weeklyResetAt: typeof storedGame.weeklyResetAt === 'string' ? storedGame.weeklyResetAt : safeGamification.weeklyResetAt })); if (Array.isArray(searches) && typeof searches[0] === 'string') setSearchTextState(searches[0]); }; void hydrate(); }, [dispatch]);
  useEffect(() => { void writeStorage(storageKeys.queue, library, 'Queue saved'); }, [library]); useEffect(() => { void writeStorage(storageKeys.badges, gamification, 'Gamification saved'); }, [gamification]);
  useEffect(() => { Object.entries(safeEntries).forEach(([id, entry]) => { const previous = seen.current[id]; if (previous && previous.status !== entry.status && entry.status === 'finished') { dispatch(recordFinished(new Date().toISOString().slice(0, 10))); if (mode === 'kids') { setShowKidsCelebration(true); setTimeout(() => setShowKidsCelebration(false), 2400); } else Alert.alert('Great work!', 'Book finished! Your streak and badges have been updated.'); } }); seen.current = safeEntries; }, [safeEntries, dispatch, mode]);
  const allBooks = [...(Array.isArray(books) ? books : []), ...safeUploadedBooks].map(book => ({ ...book, mood: safeMoods[book.id] ?? book.mood })); const recommendations = getRecommendations(user, allBooks, safeEntries); const titleKey = allBooks.map(book => book.title).join('|');
  useEffect(() => { let active = true; if (!user || recommendations.length >= 5) { setGoogleRecommendations([]); return () => { active = false; }; } void getGoogleBooksRecommendations(user.favouriteGenre, allBooks.map(book => book.title)).then(found => { if (active) setGoogleRecommendations(found); }); return () => { active = false; }; }, [user?.favouriteGenre, titleKey, recommendations.length]);
  const setSearchText = (text: string) => { setSearchTextState(text); if (text.trim()) void writeStorage(storageKeys.searches, [text].slice(0, 5), 'Search saved'); }; const clearCachedApiData = async () => { const { clearApiCache } = await import('../services/storage'); await clearApiCache(); setLastSynced(null); setOffline(false); Alert.alert('Cached data cleared', 'Fresh book data will be fetched next time you refresh.'); }; const addBook = (book: Book) => { dispatch(addUploadedBook(book)); Alert.alert('Book saved', `${book.title} was added to your library.`); }; const updatePage = (id: string, page: number) => { const previous = safeEntries[id]?.currentPage ?? 0; dispatch(setCurrentPage({ id, currentPage: page })); dispatch(recordPagesRead(Math.max(0, page - previous))); };
  return <ReadingListContext.Provider value={{ books: allBooks, genres, loading, refreshing, error, offline, lastSynced, retry: () => void load(), refresh: () => load(true), dismissOffline: () => setOffline(false), clearCachedApiData, selectedGenre, setSelectedGenre, selectedMood, setSelectedMood, searchText, setSearchText, recommendations, googleRecommendations, addBook, addExternalBook: book => addBook({ ...book, id: `local-${Date.now()}`, external: false, queued: true }), updateMood: (id, mood) => dispatch(setMood({ id, mood })), updateStatus: (id, status) => dispatch(setStatus({ id, status })), updatePage, toggleBookFavourite: id => dispatch(toggleFavourite(id)) }}>{children}{mode === 'kids' && <KidsCelebration visible={showKidsCelebration} />}</ReadingListContext.Provider>;
}
export function useReadingList() { const value = useContext(ReadingListContext); if (!value) throw new Error('useReadingList must be used within ReadingListProvider'); return value; }
