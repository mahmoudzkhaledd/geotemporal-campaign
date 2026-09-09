import { db } from "../lib/mongoose";

export const geoJsonSchema = new db.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },

    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false },
);
