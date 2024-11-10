import mongoose from 'mongoose';
import { Product } from '@/types';

const productSchema = new mongoose.Schema<Product>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  featured: { type: Boolean, default: false },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, {
  timestamps: true
});

export const ProductModel = mongoose.models.Product || mongoose.model<Product>('Product', productSchema); 