import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  isAdmin: { type: Boolean, default: false },
  image: String,
}, {
  timestamps: true
});

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema); 