import { db } from "../lib/mongoose";
import { geoJsonSchema } from "./geojson.schema";

const campaignSchema = new db.Schema({
  name: String,
  targetLocation: {
    type: geoJsonSchema,
    required: true,
  },
  radiusKm: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});
campaignSchema.index({
  targetLocation: "2dsphere",
});
export const CampaignModel = db.model("Campaign", campaignSchema);
