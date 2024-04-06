import mongoose from 'mongoose';

const menuCategorySchema = mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
    },
    position: {
      type: Number,
      default: 0,
      required: true,
    },
    menuItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
    }],
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    }
  }
);
  
// Pre-save middleware: Hash the password (similar to what you did for users)
menuCategorySchema.pre('save', async function (next) {
    // You can add any additional logic here if needed
    // For example, validation or data transformation

    // Call next() to proceed with saving the menu item
    next();
});

const MenuCategory = mongoose.model('MenuCategory', menuCategorySchema);
  
export default MenuCategory;