import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import User from "../models/User"; import Book from "../models/Book"; import Entry from "../models/ReadingListEntry"; import Review from "../models/Review"; import Gamification from "../models/Gamification";

async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany({}), Book.deleteMany({}), Entry.deleteMany({}), Review.deleteMany({}), Gamification.deleteMany({})]);
  const password = await bcrypt.hash("Admin@123", 12);
  const [admin, adult, child] = await User.create([
    { name: "ReadingList Admin", email: "admin@readinglist.app", password, role: "admin", mode: "adult" },
    { name: "Alex Morgan", email: "alex@readinglist.app", password, mode: "adult", favouriteGenre: "Fiction", readingGoal: 24, booksReadThisYear: 1, streakDays: 2 },
    { name: "Mia Morgan", email: "mia@readinglist.app", password, mode: "kids", favouriteGenre: "Fantasy", readingGoal: 12, booksReadThisYear: 1, streakDays: 4 },
  ]);
  adult.linkedChildId = child._id; await adult.save();
  const rows = [
    ["The Midnight Library", "Matt Haig", "Fiction", 304], ["Project Hail Mary", "Andy Weir", "Sci-Fi", 496], ["Educated", "Tara Westover", "Biography", 352], ["Atomic Habits", "James Clear", "Self-Help", 320], ["The Seven Husbands", "Taylor Jenkins Reid", "Fiction", 400], ["Klara and the Sun", "Kazuo Ishiguro", "Sci-Fi", 320], ["Becoming", "Michelle Obama", "Biography", 448], ["The Mountain Is You", "Brianna Wiest", "Self-Help", 248], ["The Hobbit", "J.R.R. Tolkien", "Fantasy", 310], ["A Wrinkle in Time", "Madeleine L'Engle", "Fantasy", 256], ["Charlotte's Web", "E. B. White", "Children", 192], ["Matilda", "Roald Dahl", "Children", 240],
  ];
  const books = await Book.create(rows.map(([title, author, genre, pages], index) => ({ title, author, genre, pages: Number(pages), rating: 4.1 + (index % 8) / 10, description: `${title} by ${author}.`, featured: index < 2, uploadedBy: admin._id })));
  const now = new Date();
  const entries = await Entry.create([
    { userId: adult._id, bookId: books[0]._id, status: "finished", currentPage: books[0].pages, dateAdded: new Date("2026-01-03"), dateFinished: new Date("2026-01-10") },
    { userId: adult._id, bookId: books[1]._id, status: "reading", currentPage: 188 },
    { userId: child._id, bookId: books[9]._id, status: "finished", currentPage: books[9].pages, dateFinished: now },
    { userId: child._id, bookId: books[8]._id, status: "reading", currentPage: 198 },
  ]);
  await Review.create([{ bookId: books[0]._id, userId: adult._id, rating: 5, text: "Thoughtful and moving.", readFormat: "print" }, { bookId: books[9]._id, userId: child._id, rating: 5, text: "A wonderful adventure!", readFormat: "ebook" }]);
  await Gamification.create([{ userId: adult._id, streakDays: adult.streakDays, badges: ["First Chapter"], weeklyPagesRead: 188 }, { userId: child._id, streakDays: child.streakDays, badges: ["First Chapter"], weeklyPagesRead: 198 }]);
  console.log(`Seeded ${books.length} books and ${entries.length} reading list entries. Admin: admin@readinglist.app / Admin@123`);
  await mongoose.disconnect();
}
seed().catch(async error => { console.error(error); await mongoose.disconnect(); process.exitCode = 1; });
