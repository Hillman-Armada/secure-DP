import mongoose from 'mongoose';
import { Order } from '@/types';

const orderSchema = new mongoose.Schema<Order>({
  user: { 
    type: String,
    ref: 'User',
    required: true 
  },
  orderItems: [{
    _id: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    ratings: { type: Number },
    numReviews: { type: Number },
  }],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date },
}, {
  timestamps: true
});

export const OrderModel = mongoose.models.Order || mongoose.model<Order>('Order', orderSchema); 