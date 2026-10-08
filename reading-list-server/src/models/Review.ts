import { Schema, model, models } from "mongoose";
const schema = new Schema({ bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true }, userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, rating: { type: Number, required: true, min: 1, max: 5 }, text: { type: String, required: true }, readFormat: String }, { timestamps: { createdAt: true, updatedAt: false }, toJSON: { transform: (_doc, ret: any) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; ret.comment = ret.text; return ret; } } });
export default models.Review || model("Review", schema);
