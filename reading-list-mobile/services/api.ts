import axios from 'axios';
import { Book, User } from '../types';

// For Android emulator change localhost to 10.0.2.2 if needed.
export const API_BASE_URL = 'http://192.168.1.42:5001';
const client = axios.create({ baseURL: API_BASE_URL, timeout: 5000 });
export const getBooks = async (): Promise<Book[]> => { const response = await fetch(`${API_BASE_URL}/books`); if (!response.ok) throw new Error(`Could not load books (${response.status})`); return response.json() as Promise<Book[]>; };
type GenreResponse = string | { id: string | number; name: string };
export const getGenres = async (): Promise<string[]> => { const response = await fetch(`${API_BASE_URL}/genres`); if (!response.ok) throw new Error(`Could not load genres (${response.status})`); const genres = await response.json() as GenreResponse[]; return genres.map(genre => typeof genre === 'string' ? genre : genre.name); };
export const getUser = async (id: string): Promise<User> => (await client.get<User>(`/users/${id}`)).data;
export const getFeatured = async (): Promise<Book[]> => (await client.get<Book[]>('/featured')).data;
