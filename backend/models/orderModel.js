import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    tableNum: {
      type: Number,
      required: true
    },
    items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      notes: String,
      quantity: Number
    }],
    time: {
      type: Date,
      required: true
    },
    notes : {
      type: String
    },
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