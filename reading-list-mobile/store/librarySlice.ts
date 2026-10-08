import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sampleBooks } from '../data/sampleBooks';
import { Book, BookMood, ReadingEntry, ReadingStatus } from '../types';

type LibraryState = { entries: Record<string, ReadingEntry>; favourites: string[]; uploadedBooks: Book[]; moods: Record<string, BookMood> };
const initialState: LibraryState = {
  entries: Object.fromEntries(sampleBooks.map(book => [book.id, { status: book.queued ? 'to-read' : 'reading', currentPage: 0 }])),
  favourites: ['1', '5'],
  uploadedBooks: [],
  moods: {},
};
const librarySlice = createSlice({ name: 'library', initialState, reducers: {
  setStatus: (state, action: PayloadAction<{ id: string; status: ReadingStatus }>) => { state.entries[action.payload.id].status = action.payload.status; },
  setCurrentPage: (state, action: PayloadAction<{ id: string; currentPage: number }>) => { state.entries[action.payload.id].currentPage = Math.max(0, action.payload.currentPage); state.entries[action.payload.id].lastProgressUpdatedAt = new Date().toISOString(); },
  toggleFavourite: (state, action: PayloadAction<string>) => { state.favourites = state.favourites.includes(action.payload) ? state.favourites.filter(id => id !== action.payload) : [...state.favourites, action.payload]; },
  hydrateLibrary: (_state, action: PayloadAction<LibraryState>) => action.payload,
  addUploadedBook: (state, action: PayloadAction<Book>) => { state.uploadedBooks.push(action.payload); state.entries[action.payload.id] = { status: 'to-read', currentPage: 0 }; },
  setMood: (state, action: PayloadAction<{ id: string; mood: BookMood }>) => { state.moods[action.payload.id] = action.payload.mood; const uploaded = state.uploadedBooks.find(book => book.id === action.payload.id); if (uploaded) uploaded.mood = action.payload.mood; },
} });
export const { setStatus, setCurrentPage, toggleFavourite, hydrateLibrary, addUploadedBook, setMood } = librarySlice.actions;
export default librarySlice.reducer;
