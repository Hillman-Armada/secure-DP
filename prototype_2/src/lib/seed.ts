import { dbConnect } from './mongodb';
import { ProductModel } from '@/models/Product';

const sampleProducts = [
  {
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    category: "Electronics",
    stock: 50,
    featured: true,
    ratings: 4.5,
    numReviews: 89,
  },
  {
    name: "Smart Watch",
    description: "Latest smartwatch with health tracking features",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800",
    category: "Electronics",
    stock: 30,
    featured: true,
    ratings: 4.7,
    numReviews: 125,
  },
  {
    name: "Running Shoes",
    description: "Comfortable running shoes for professional athletes",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    category: "Sports",
    stock: 100,
    featured: true,
    ratings: 4.3,
    numReviews: 230,
  },
  {
    name: "Laptop Backpack",
    description: "Water-resistant laptop backpack with multiple compartments",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    category: "Fashion",
    stock: 75,
    featured: true,
    ratings: 4.4,
    numReviews: 156,
  },
];

export async function seedProducts() {
  try {
    await dbConnect();
    
    // Clear existing products
    await ProductModel.deleteMany({});
    
    // Insert sample products
    await ProductModel.insertMany(sampleProducts);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
} 