import axios from 'axios';
import { Book, User } from '../types';

// For Android emulator change localhost to 10.0.2.2 if needed.
export const API_BASE_URL = 'http://10.0.2.2:5001';
const client = axios.create({ baseURL: API_BASE_URL, timeout: 5000 });
const API_TIMEOUT_MS = 5000;
async function fetchApi<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { signal: controller.signal });
    if (!response.ok) throw new Error(`Could not load ${path.slice(1)} (${response.status})`);
    return await response.json() as T;
  } catch (cause) {
    if (controller.signal.aborted) throw new Error(`API request timed out after ${API_TIMEOUT_MS / 1000} seconds: ${path}`);
    throw cause;
  } finally {
    clearTimeout(timeout);
  }
}
type GenreResponse = string | { id: string | number; name: string };
export const getBooks = async (): Promise<Book[]> => fetchApi<Book[]>('/books');
export const getGenres = async (): Promise<string[]> => (await fetchApi<GenreResponse[]>('/genres')).map(genre => typeof genre === 'string' ? genre : genre.name);
export const getUser = async (id: string): Promise<User> => (await client.get<User>(`/users/${id}`)).data;
export const getFeatured = async (): Promise<Book[]> => (await client.get<Book[]>('/featured')).data;

/** Optional public discovery data; this never changes the user's library. */
export async function getGoogleBooksRecommendations(genre: string, excludeTitles: string[]): Promise<Book[]> {
  try {
    const query = encodeURIComponent(`subject:${genre}`);
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10`);
    if (!response.ok) return [];
    const payload = await response.json() as { items?: Array<{ id: string; volumeInfo?: { title?: string; authors?: string[]; description?: string; pageCount?: number; imageLinks?: { thumbnail?: string } } }> };
    const excluded = new Set(excludeTitles.map(title => title.trim().toLowerCase()));
    return (payload.items ?? []).map(({ id, volumeInfo }) => ({
      id: `google-${id}`, title: volumeInfo?.title ?? 'Untitled', author: volumeInfo?.authors?.join(', ') ?? 'Unknown author',
      genre, description: volumeInfo?.description ?? 'Discover this suggested read on Google Books.', pages: volumeInfo?.pageCount ?? 0,
      rating: 0, cover: volumeInfo?.imageLinks?.thumbnail?.replace(/^http:/, 'https:') ?? 'https://via.placeholder.com/300x450?text=Book', external: true,
    })).filter(book => !excluded.has(book.title.trim().toLowerCase()));
  } catch { return []; }
}
