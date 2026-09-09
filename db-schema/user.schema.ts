import { db } from "../lib/mongoose";
import { geoJsonSchema } from "./geojson.schema";

const userSchema = new db.Schema({
  name: String,
  email: String,
  phone: String,
  lastLocation: {
    type: geoJsonSchema,
    required: true,
  },
});
userSchema.index({
  lastLocation: "2dsphere",
});

export const UserModel = db.model("User", userSchema);
