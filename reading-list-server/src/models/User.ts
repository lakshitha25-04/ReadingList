import { Schema, model, models } from "mongoose";
const userSchema = new Schema({
  name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, role: { type: String, enum: ["user", "admin"], default: "user" },
  mode: { type: String, enum: ["adult", "kids"], required: true }, favouriteGenre: { type: String, default: "" },
  readingGoal: { type: Number, default: 0 }, booksReadThisYear: { type: Number, default: 0 }, streakDays: { type: Number, default: 0 },
  linkedChildId: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: { createdAt: true, updatedAt: false }, toJSON: { transform: (_doc, ret: any) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; delete ret.password; return ret; } } });
export default models.User || model("User", userSchema);
