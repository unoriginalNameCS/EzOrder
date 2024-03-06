import mongoose from 'mongoose';

const menuItemSchema = mongoose.Schema(
    {
      name: { 
        type: String, 
        required: true,
        unique: true,
      },
      price: { 
        type: Number, 
        required: true 
      },
    }
);
  
// Pre-save middleware: Hash the password (similar to what you did for users)
menuItemSchema.pre('save', async function (next) {
    // You can add any additional logic here if needed
    // For example, validation or data transformation

    // Call next() to proceed with saving the menu item
    next();
});

const menuItem = mongoose.model('menuItem', menuItemSchema);
  
export default menuItem;