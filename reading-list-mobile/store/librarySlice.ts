import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sampleBooks } from '../data/sampleBooks';
import { Book, ReadingEntry, ReadingStatus } from '../types';

type LibraryState = { entries: Record<string, ReadingEntry>; favourites: string[]; uploadedBooks: Book[] };
const initialState: LibraryState = {
  entries: Object.fromEntries(sampleBooks.map(book => [book.id, { status: book.queued ? 'to-read' : 'reading', currentPage: 0 }])),
  favourites: ['1', '5'],
  uploadedBooks: [],
};
const librarySlice = createSlice({ name: 'library', initialState, reducers: {
  setStatus: (state, action: PayloadAction<{ id: string; status: ReadingStatus }>) => { state.entries[action.payload.id].status = action.payload.status; },
  setCurrentPage: (state, action: PayloadAction<{ id: string; currentPage: number }>) => { state.entries[action.payload.id].currentPage = Math.max(0, action.payload.currentPage); },
  toggleFavourite: (state, action: PayloadAction<string>) => { state.favourites = state.favourites.includes(action.payload) ? state.favourites.filter(id => id !== action.payload) : [...state.favourites, action.payload]; },
  hydrateLibrary: (_state, action: PayloadAction<LibraryState>) => action.payload,
  addUploadedBook: (state, action: PayloadAction<Book>) => { state.uploadedBooks.push(action.payload); state.entries[action.payload.id] = { status: 'to-read', currentPage: 0 }; },
} });
export const { setStatus, setCurrentPage, toggleFavourite, hydrateLibrary, addUploadedBook } = librarySlice.actions;
export default librarySlice.reducer;
