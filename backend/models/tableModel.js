import mongoose from 'mongoose';

const tableSchema = mongoose.Schema(
  {
    number: {
        type: Number,
        required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    occupied: {
        type: Boolean,
        default: false,
        required: true
    }
  }
);
  
// Pre-save middleware: Hash the password (similar to what you did for users)
menuCategorySchema.pre('save', async function (next) {
    
    next();
});

const Table = mongoose.model('Table', tableSchema);
  
export default Table;