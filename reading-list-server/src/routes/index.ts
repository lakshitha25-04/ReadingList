import { Router } from "express";
import { createBook, deleteBook, getBook, getBooks, updateBook } from "../controllers/books.controller";
import { createReadingListItem, deleteReadingListItem, getReadingList, updateReadingListItem } from "../controllers/reading-list.controller";
import { checkGamification, createReview, getGamification, getReviews, parentDashboard } from "../controllers/social.controller";
import { getUser, linkChild, updateUser } from "../controllers/users.controller";

export const createApiRouter = (upload: import("multer").Multer) => {
  const router = Router();
  router.get("/books", getBooks).get("/books/:id", getBook).post("/books", upload.fields([{ name: "cover", maxCount: 1 }, { name: "file", maxCount: 1 }]), createBook).put("/books/:id", updateBook).delete("/books/:id", deleteBook);
  router.get("/users/:id", getUser).put("/users/:id", updateUser).post("/users/:id/link-child", linkChild);
  router.get("/readinglist/:userId", getReadingList).post("/readinglist", createReadingListItem).put("/readinglist/:id", updateReadingListItem).delete("/readinglist/:id", deleteReadingListItem);
  router.get("/reviews/:bookId", getReviews).post("/reviews", createReview);
  router.get("/gamification/:userId", getGamification).post("/gamification/:userId/check", checkGamification);
  router.get("/parent/:userId/dashboard", parentDashboard);
  return router;
};
