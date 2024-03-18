import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
    },
    items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      notes: String,
      quantity: Number
    }],
    state: {
      type: String,
      required: true,
      enum: ['pending', 'preparing', 'serve']
    }
  }
);
  
// Pre-save middleware: Hash the password (similar to what you did for users)
orderSchema.pre('save', async function (next) {
    
    next();
});

const Order = mongoose.model('Order', orderSchema);
  
export default Order;