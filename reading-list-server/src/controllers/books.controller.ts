import { Request, Response } from "express";
import { books, nextId } from "../data/store";

const send = (res: Response, status: number, data?: unknown, message?: string) => res.status(status).json({ success: status < 400, ...(data !== undefined && { data }), ...(message && { message }) });

export const getBooks = (_req: Request, res: Response) => send(res, 200, books);
export const getBook = (req: Request, res: Response) => {
  const book = books.find((item) => item.id === req.params.id);
  return book ? send(res, 200, book) : send(res, 404, undefined, "Book not found");
};
export const createBook = (req: Request, res: Response) => {
  const { title, author, genre, description } = req.body;
  if (!title || !author || !genre || !description) return send(res, 400, undefined, "title, author, genre, and description are required");
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const image = files?.cover?.[0];
  const document = files?.file?.[0];
  const book = { id: nextId("book", books), title, author, genre, description, rating: Number(req.body.rating) || 0, pages: Number(req.body.pages) || 0, featured: req.body.featured === "true" || req.body.featured === true, queued: req.body.queued === "true" || req.body.queued === true, ...(image && { cover: `/uploads/${image.filename}` }), ...(document && { file: `/uploads/${document.filename}` }) };
  books.push(book);
  return send(res, 201, book);
};
export const updateBook = (req: Request, res: Response) => {
  const index = books.findIndex((item) => item.id === req.params.id);
  if (index < 0) return send(res, 404, undefined, "Book not found");
  const current = books[index];
  const updates = { ...req.body } as Record<string, unknown>;
  if (updates.rating !== undefined) updates.rating = Number(updates.rating);
  if (updates.pages !== undefined) updates.pages = Number(updates.pages);
  books[index] = { ...current, ...updates, id: current.id };
  return send(res, 200, books[index]);
};
export const deleteBook = (req: Request, res: Response) => {
  const index = books.findIndex((item) => item.id === req.params.id);
  if (index < 0) return send(res, 404, undefined, "Book not found");
  books.splice(index, 1);
  return send(res, 200, undefined, "Book deleted");
};
