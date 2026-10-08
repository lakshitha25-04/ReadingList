import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
const send = (res: Response, status: number, data?: unknown, message?: string) => res.status(status).json({ success: status < 400, ...(data !== undefined && { data }), ...(message && { message }) });
export async function register(req: Request, res: Response) {
  const { name, email, password, mode } = req.body;
  if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== "string" || password.length < 8 || !["adult", "kids"].includes(mode)) return send(res, 400, undefined, "Valid name, email, password (at least 8 characters), and mode are required");
  try { if (await User.exists({ email: email.toLowerCase() })) return send(res, 409, undefined, "Email already registered"); const user = await User.create({ name: name.trim(), email: email.toLowerCase(), password: await bcrypt.hash(password, 12), mode }); return send(res, 201, user); }
  catch (error: any) { if (error?.code === 11000) return send(res, 409, undefined, "Email already registered"); throw error; }
}
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (typeof email !== "string" || typeof password !== "string") return send(res, 400, undefined, "Email and password are required");
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.password))) return send(res, 401, undefined, "Invalid email or password");
  const secret = process.env.JWT_SECRET; if (!secret) return send(res, 500, undefined, "JWT_SECRET is not configured");
  return send(res, 200, { token: jwt.sign({}, secret, { subject: user.id, expiresIn: "7d" }), user });
}
