import mongoose from "mongoose";

const restaurantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    // logoUrl: {
    //     type: String
    // },
    menu: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuCategory'
    }],
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;