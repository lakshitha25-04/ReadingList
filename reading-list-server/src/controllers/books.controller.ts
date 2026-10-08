import { Request, Response } from "express";
import mongoose from "mongoose";
import Book from "../models/Book";
const send = (res: Response, status: number, data?: unknown, message?: string) => res.status(status).json({ success: status < 400, ...(data !== undefined && { data }), ...(message && { message }) });
const badId = (id: string) => !mongoose.isValidObjectId(id);
export async function getBooks(_req: Request, res: Response) { return send(res, 200, await Book.find()); }
export async function getBook(req: Request, res: Response) { if (badId(String(req.params.id))) return send(res, 400, undefined, "Invalid book id"); const book = await Book.findById(String(req.params.id)); return book ? send(res, 200, book) : send(res, 404, undefined, "Book not found"); }
export async function createBook(req: Request, res: Response) {
  const { title, author, genre, description } = req.body;
  if (!title || !author || !genre || !description) return send(res, 400, undefined, "title, author, genre, and description are required");
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined, image = files?.cover?.[0], document = files?.file?.[0];
  const book = await Book.create({ title, author, genre, description, rating: Number(req.body.rating) || 0, pages: Number(req.body.pages) || 0, featured: req.body.featured === "true" || req.body.featured === true, mood: req.body.mood, coverUrl: image ? `/uploads/${image.filename}` : req.body.coverUrl, fileUrl: document ? `/uploads/${document.filename}` : req.body.fileUrl, uploadedBy: req.authUser?.id });
  return send(res, 201, book);
}
export async function updateBook(req: Request, res: Response) { if (badId(String(req.params.id))) return send(res, 400, undefined, "Invalid book id"); const book = await Book.findByIdAndUpdate(String(req.params.id), req.body, { new: true, runValidators: true }); return book ? send(res, 200, book) : send(res, 404, undefined, "Book not found"); }
export async function deleteBook(req: Request, res: Response) { if (badId(String(req.params.id))) return send(res, 400, undefined, "Invalid book id"); const book = await Book.findByIdAndDelete(String(req.params.id)); return book ? send(res, 200, undefined, "Book deleted") : send(res, 404, undefined, "Book not found"); }
