import mongoose from 'mongoose';

const menuCategorySchema = mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      unique: true,
    },
    items: {
        type: [String],
        required: true,
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

const menuCategory = mongoose.model('menuCategory', menuCategorySchema);
  
export default menuCategory;