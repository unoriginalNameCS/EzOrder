import mongoose from 'mongoose';

const cartItemSchema = mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    notes: String,
    quantity: {
      type: Number,
      default: 1 // Default quantity is 1
    }
  }
);
  
// Pre-save middleware: Hash the password (similar to what you did for users)
cartItemSchema.pre('save', async function (next) {
    // You can add any additional logic here if needed
    // For example, validation or data transformation

    // Call next() to proceed with saving the menu item
    next();
});

const CartItem = mongoose.model('CartItem', cartItemSchema);
  
export default CartItem;