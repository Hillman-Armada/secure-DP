import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { ProductModel } from '@/models/Product';
import { Product } from '@/types';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    
    let query: Record<string, any> = {};
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (category) {
      query.category = category;
    }
    
    const products = await ProductModel.find(query)
      .sort({ createdAt: -1 })
      .lean<Product[]>();

    // Transform _id to string and ensure type safety
    const transformedProducts: Product[] = products.map(product => ({
      ...product,
      _id: product._id.toString(),
    }));
    
    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Error fetching products' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const product = await ProductModel.create(body);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'Error creating product' },
      { status: 500 }
    );
  }
} 