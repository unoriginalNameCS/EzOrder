import mongoose from 'mongoose';

const menuItemSchema = mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
    },
    description: {
      type: String,
    },
    price: { 
      type: Number, 
      required: true,
    },
    ingredients: [String],
    imageUrl: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuCategory',
      required: true,
    },
    position: {
      type: Number,
      default: 0,
      required: true,
    }
  }
);
  
// Pre-save middleware
menuItemSchema.pre('save', async function (next) {
    next();
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
  
export default MenuItem;