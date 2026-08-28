import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useState } from 'react';
import { ReadingMode, User } from '../types';
import { clearSessionStorage, readStorage, storageKeys, writeStorage } from '../services/storage';
const initialUser: User = { name: 'Alex Morgan', email: 'alex@readinglist.app', favouriteGenre: 'Fiction', booksReadThisYear: 12, streakDays: 2, mode: 'adult' };
type RegisteredUser = User & { phone: string; gender: string; dateOfBirth: string; city: string; passwordHash: string };
type RegistrationInput = Omit<RegisteredUser, 'mode' | 'booksReadThisYear' | 'streakDays' | 'passwordHash'> & { password: string };
type UserValue = { user: User | null; mode: ReadingMode; login: (email: string, password: string) => Promise<{ ok: boolean; message: string }>; register: (input: RegistrationInput) => Promise<{ ok: boolean; message: string }>; logout: () => Promise<void>; setMode: (mode: ReadingMode) => void; persistMode: (mode: ReadingMode) => Promise<void>; restoreSession: (mode: ReadingMode) => Promise<void> };
const UserContext = createContext<UserValue | undefined>(undefined);

// Prototype-only one-way hash. A real backend must replace this with bcrypt/argon2.
const hashPassword = (value: string) => { let hash = 5381; for (let index = 0; index < value.length; index += 1) hash = ((hash << 5) + hash) ^ value.charCodeAt(index); return `mock-hash-${(hash >>> 0).toString(16)}`; };
const getRegisteredUsers = async (): Promise<RegisteredUser[]> => { const saved = await AsyncStorage.getItem('registered_users'); if (!saved) return []; try { return JSON.parse(saved) as RegisteredUser[]; } catch { return []; } };
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [mode, setModeState] = useState<ReadingMode>('adult');
  const setMode = (next: ReadingMode) => { setModeState(next); setUser(current => current ? { ...current, mode: next } : current); };
  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const mockUser = normalizedEmail === 'alex@readinglist.app' && password === 'Reader123';
    const registeredUser = (await getRegisteredUsers()).find(candidate => candidate.email.toLowerCase() === normalizedEmail && candidate.passwordHash === hashPassword(password));
    if (!mockUser && !registeredUser) return { ok: false, message: 'Invalid email or password.' };
    setUser(registeredUser ? { ...registeredUser, mode } : { ...initialUser, email: normalizedEmail, mode });
    return { ok: true, message: 'Login successful. Choose a reading mode.' };
  };
  const register = async (input: RegistrationInput) => {
    const users = await getRegisteredUsers(); const email = input.email.trim().toLowerCase();
    if (email === initialUser.email || users.some(candidate => candidate.email.toLowerCase() === email)) return { ok: false, message: 'An account already exists for this email.' };
    const registeredUser: RegisteredUser = { name: input.name.trim(), email, phone: input.phone, gender: input.gender, dateOfBirth: input.dateOfBirth, city: input.city, favouriteGenre: input.favouriteGenre, passwordHash: hashPassword(input.password), booksReadThisYear: 0, streakDays: 0, mode: 'adult' };
    await AsyncStorage.setItem('registered_users', JSON.stringify([...users, registeredUser]));
    return { ok: true, message: 'Registration successful. You can now log in.' };
  };
  const persistMode = async (next: ReadingMode) => { const currentUser = user ?? initialUser; setMode(next); const token = `mock.jwt.${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}`; await Promise.all([AsyncStorage.setItem(storageKeys.token, token), writeStorage(storageKeys.mode, next, 'Mode saved'), writeStorage(storageKeys.user, { ...currentUser, mode: next }, 'User saved')]); };
  const restoreSession = async (next: ReadingMode) => { const storedUser = await readStorage<User>(storageKeys.user, { ...initialUser, mode: next }); setModeState(next); setUser({ ...storedUser, mode: next }); };
  const logout = async () => { await clearSessionStorage(); setUser(null); setModeState('adult'); };
  return <UserContext.Provider value={{ user, mode, setMode, login, register, logout, persistMode, restoreSession }}>{children}</UserContext.Provider>;
}
export function useUser() { const value = useContext(UserContext); if (!value) throw new Error('useUser must be used within UserProvider'); return value; }
