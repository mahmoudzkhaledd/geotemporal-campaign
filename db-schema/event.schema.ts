import { db } from "../lib/mongoose";

const eventSchema = new db.Schema({
  name: String,
  userId: {
    type: db.Types.ObjectId,
    ref: "User",
    required: true,
  },
  campaignId: {
    type: db.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  type: {
    type: String,
    enum: ["view", "click", "purchase"],
    required: true,
  },
  revenue: Number,
  timestamp: Date,
});

eventSchema.index({
  campaignId: 1,
  userId: 1,
  timestamp: 1,
});

export const EventModel = db.model("Event", eventSchema);
