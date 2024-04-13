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
  
// Pre-save middleware
menuCategorySchema.pre('save', async function (next) {
    next();
});

const MenuCategory = mongoose.model('MenuCategory', menuCategorySchema);
  
export default MenuCategory;