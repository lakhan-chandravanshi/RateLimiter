import mongoose from "mongoose";

const rateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 },
  windowStart: { type: Date, required: true }
});

export default mongoose.model("RateLimit", rateLimitSchema);
