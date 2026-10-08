import { Schema, model, models } from "mongoose";
const schema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true }, status: { type: String, enum: ["to-read", "reading", "finished"], default: "to-read" }, currentPage: { type: Number, default: 0 }, rating: Number, notes: String, dateAdded: { type: Date, default: Date.now }, dateFinished: Date });
schema.index({ userId: 1, bookId: 1 }, { unique: true });
schema.set("toJSON", { transform: (_doc, ret: any) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; ret.progress = ret.currentPage; ret.addedAt = ret.dateAdded; ret.finishedAt = ret.dateFinished; if (ret.status === "to-read") ret.status = "want-to-read"; return ret; } });
export default models.ReadingListEntry || model("ReadingListEntry", schema);
