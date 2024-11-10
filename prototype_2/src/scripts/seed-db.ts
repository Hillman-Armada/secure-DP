import { dbConnect } from '@/lib/mongodb';
import { ProductModel } from '@/models/Product';

const products = [
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
  // ... other products from seed.ts
];

async function seedDatabase() {
  try {
    await dbConnect();
    
    // Clear existing products
    await ProductModel.deleteMany({});
    
    // Insert new products
    await ProductModel.insertMany(products);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 