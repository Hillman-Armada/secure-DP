import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { searchProducts } from '@/lib/products';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';

    await dbConnect();
    const products = await searchProducts(query);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}

// Add this for static export
export const dynamic = 'force-dynamic'; 