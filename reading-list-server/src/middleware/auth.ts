import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";
declare global { namespace Express { interface Request { authUser?: { id: string; role: "user" | "admin" } } } }
const send = (res: Response, status: number, message: string) => res.status(status).json({ success: false, message });
export async function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return send(res, 401, "Authentication required");
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return send(res, 500, "JWT_SECRET is not configured");
    const payload = jwt.verify(token, secret) as JwtPayload;
    const user = await User.findById(payload.sub).select("role");
    if (!user) return send(res, 401, "Invalid token");
    req.authUser = { id: user.id, role: user.role };
    next();
  } catch { return send(res, 401, "Invalid or expired token"); }
}
export function adminOnly(req: Request, res: Response, next: NextFunction) {
  if (req.authUser?.role !== "admin") return send(res, 403, "Admin access required");
  next();
}
