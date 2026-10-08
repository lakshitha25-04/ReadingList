import { Schema, model, models } from "mongoose";
const schema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true }, streakDays: { type: Number, default: 0 }, badges: { type: [String], default: [] }, lastReadDate: Date, weeklyPagesRead: { type: Number, default: 0 } });
export default models.Gamification || model("Gamification", schema);
