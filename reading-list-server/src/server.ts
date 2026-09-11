import "dotenv/config";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { createApiRouter } from "./routes";

const app = express();
const uploadsDir = path.resolve(process.cwd(), "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));
app.use((req, res, next) => { const started = Date.now(); res.on("finish", () => console.log(JSON.stringify({ timestamp: new Date().toISOString(), method: req.method, path: req.path, status: res.statusCode, durationMs: Date.now() - started }))); next(); });
app.get("/api/health", (_req, res) => res.status(200).json({ success: true, data: { status: "ok" } }));
app.use("/api", createApiRouter(upload));
app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => { console.error(err); res.status(500).json({ success: false, message: "Internal server error" }); });

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => console.log(`ReadingList server listening on port ${port}`));
