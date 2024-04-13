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
  
// Pre-save middleware
cartItemSchema.pre('save', async function (next) {
    next();
});

const CartItem = mongoose.model('CartItem', cartItemSchema);
  
export default CartItem;