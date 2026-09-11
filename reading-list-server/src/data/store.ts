import { Book, ReadingListItem, Review, User } from "../types";

export const genres = ["Fiction", "Sci-Fi", "Biography", "Self-Help", "Fantasy"];

const cover = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80";
export const books: Book[] = [
  { id: "1", title: "The Midnight Library", author: "Matt Haig", genre: "Fiction", rating: 4.5, pages: 304, featured: true, queued: true, description: "Between life and death there is a library of possible lives.", cover },
  { id: "2", title: "Project Hail Mary", author: "Andy Weir", genre: "Sci-Fi", rating: 4.7, pages: 496, queued: true, description: "A lone astronaut has an impossible mission to save Earth.", cover },
  { id: "3", title: "Educated", author: "Tara Westover", genre: "Biography", rating: 4.6, pages: 352, description: "A memoir about education and transformation.", cover },
  { id: "4", title: "Atomic Habits", author: "James Clear", genre: "Self-Help", rating: 4.8, pages: 320, queued: true, description: "A practical guide to tiny changes and remarkable results.", cover },
  { id: "5", title: "The Seven Husbands", author: "Taylor Jenkins Reid", genre: "Fiction", rating: 4.4, pages: 400, description: "A film icon tells her glamorous life story.", cover },
  { id: "6", title: "Klara and the Sun", author: "Kazuo Ishiguro", genre: "Sci-Fi", rating: 4.2, pages: 320, description: "An artificial friend dreams of being chosen.", cover },
  { id: "7", title: "Becoming", author: "Michelle Obama", genre: "Biography", rating: 4.8, pages: 448, description: "The former First Lady shares her life story.", cover },
  { id: "8", title: "The Mountain Is You", author: "Brianna Wiest", genre: "Self-Help", rating: 4.3, pages: 248, description: "A guide to overcoming self-sabotage.", cover },
  { id: "9", title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", rating: 4.7, pages: 310, description: "A reluctant hobbit joins an unexpected adventure.", cover },
  { id: "10", title: "A Wrinkle in Time", author: "Madeleine L'Engle", genre: "Fantasy", rating: 4.1, pages: 256, description: "Three children travel through space and time.", cover },
];

export const users: User[] = [
  { id: "1", name: "Alex Morgan", email: "alex@readinglist.app", favouriteGenre: "Fiction", booksReadThisYear: 12, streakDays: 2, mode: "adult", childIds: ["2"] },
  { id: "2", name: "Mia Morgan", email: "mia@readinglist.app", favouriteGenre: "Fantasy", booksReadThisYear: 3, streakDays: 4, mode: "kids", parentId: "1" },
];

export const readingList: ReadingListItem[] = [
  { id: "rl-1", userId: "1", bookId: "1", status: "finished", progress: 100, addedAt: "2026-01-03T00:00:00.000Z", finishedAt: "2026-01-10T00:00:00.000Z" },
  { id: "rl-2", userId: "1", bookId: "2", status: "reading", progress: 38, addedAt: "2026-02-01T00:00:00.000Z" },
  { id: "rl-3", userId: "2", bookId: "10", status: "finished", progress: 100, addedAt: "2026-02-03T00:00:00.000Z", finishedAt: "2026-02-09T00:00:00.000Z" },
  { id: "rl-4", userId: "2", bookId: "9", status: "reading", progress: 64, addedAt: "2026-02-12T00:00:00.000Z" },
];

export const reviews: Review[] = [
  { id: "review-1", bookId: "1", userId: "1", rating: 5, comment: "Thoughtful and moving.", createdAt: "2026-01-10T00:00:00.000Z" },
];

export const nextId = (prefix: string, items: { id: string }[]) => `${prefix}-${items.length + 1}-${Date.now()}`;
