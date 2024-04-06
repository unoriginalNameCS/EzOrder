import mongoose from "mongoose";

const restaurantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    logoUrl: {
        type: String
    },
    bannerUrl: {
      type: String
    },
  }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;