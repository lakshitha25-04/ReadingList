import { configureStore } from '@reduxjs/toolkit';
import library from './librarySlice';
import gamification from './gamificationSlice';
export const store = configureStore({ reducer: { library, gamification } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
