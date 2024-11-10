import { Product } from '@/types';
import { ProductModel } from '@/models/Product';
import { dbConnect } from './mongodb';
import { Document } from 'mongoose';

export async function getProduct(id: string): Promise<Product | null> {
  try {
    await dbConnect();
    
    const product = await ProductModel.findById(id);
    
    if (!product) {
      return null;
    }
    
    // Convert MongoDB document to plain object and ensure it matches Product type
    const productObject = product.toObject();
    
    // Convert dates to strings and ensure all required fields are present
    const formattedProduct: Product = {
      _id: productObject._id.toString(),
      name: productObject.name,
      description: productObject.description,
      price: productObject.price,
      image: productObject.image,
      category: productObject.category,
      stock: productObject.stock,
      ratings: productObject.ratings,
      numReviews: productObject.numReviews,
      createdAt: productObject.createdAt ? new Date(productObject.createdAt).toISOString() : undefined,
      updatedAt: productObject.updatedAt ? new Date(productObject.updatedAt).toISOString() : undefined,
    };

    return formattedProduct;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Define an interface for the raw product data
interface RawProduct {
  _id: any;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  ratings?: number;
  numReviews?: number;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

// Helper function to format a product
function formatProduct(product: RawProduct): Product {
  return {
    _id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
    stock: product.stock,
    ratings: product.ratings,
    numReviews: product.numReviews,
    createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : undefined,
    updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : undefined,
  };
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    await dbConnect();
    const products = await ProductModel.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean() as RawProduct[];
    
    return products.map(formatProduct);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    await dbConnect();
    const products = await ProductModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    })
      .limit(10)
      .lean() as RawProduct[];

    return products.map(formatProduct);
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
} 