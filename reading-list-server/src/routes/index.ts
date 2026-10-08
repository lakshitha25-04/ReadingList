import { Router } from "express";
import { createBook, deleteBook, getBook, getBooks, updateBook } from "../controllers/books.controller";
import { createReadingListItem, deleteReadingListItem, getReadingList, updateReadingListItem } from "../controllers/reading-list.controller";
import { checkGamification, createReview, getGamification, getReviews, parentDashboard } from "../controllers/social.controller";
import { getUser, linkChild, updateUser } from "../controllers/users.controller";
import { login, register } from "../controllers/auth.controller";
import { auth, adminOnly } from "../middleware/auth";

export const createApiRouter = (upload: import("multer").Multer) => {
  const router = Router();
  router.post("/auth/register", register).post("/auth/login", login);
  router.get("/books", getBooks).get("/books/:id", getBook).post("/books", auth, upload.fields([{ name: "cover", maxCount: 1 }, { name: "file", maxCount: 1 }]), createBook).put("/books/:id", auth, adminOnly, updateBook).delete("/books/:id", auth, adminOnly, deleteBook);
  router.get("/users/:id", getUser).put("/users/:id", updateUser).post("/users/:id/link-child", linkChild);
  router.get("/readinglist/:userId", getReadingList).post("/readinglist", createReadingListItem).put("/readinglist/:id", updateReadingListItem).delete("/readinglist/:id", deleteReadingListItem);
  router.get("/reviews/:bookId", getReviews).post("/reviews", createReview);
  router.get("/gamification/:userId", getGamification).post("/gamification/:userId/check", checkGamification);
  router.get("/parent/:userId/dashboard", parentDashboard);
  return router;
};
