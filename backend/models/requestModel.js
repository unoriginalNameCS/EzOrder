import mongoose from 'mongoose';

const requestSchema = mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    state: {
      type: String,
      required: true,
      enum: ['waiting', 'assisting', 'complete']
    },
    tableNum: {
      type: Number,
      required: true,
    },
    requestedBill: {
      type: Boolean,
      required: true,
    },
    time: {
      type: Date,
      required: true
    },
    requestNum: {
      type: Number,
      required: true
    },
  }
);
  
// Pre-save middleware
requestSchema.pre('save', async function (next) {
    next();
});

const Request = mongoose.model('Request', requestSchema);
  
export default Request;