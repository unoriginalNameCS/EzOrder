import mongoose from 'mongoose';

const UserResetPasswordSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    verification_code: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
  
);

UserResetPasswordSchema.pre('save', async function (next) {
    next();
});

const UserResetPassword = mongoose.model('UserResetPassword', UserResetPasswordSchema);

export default UserResetPassword;