import mongoose from 'mongoose';

const menuItemSchema = mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      unique: true,
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
  
// Pre-save middleware: Hash the password (similar to what you did for users)
menuItemSchema.pre('save', async function (next) {
    // You can add any additional logic here if needed
    // For example, validation or data transformation

    // Call next() to proceed with saving the menu item
    next();
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
  
export default MenuItem;