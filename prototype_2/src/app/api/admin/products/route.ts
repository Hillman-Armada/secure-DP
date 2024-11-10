import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { ProductModel } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Middleware to check admin status
async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.isAdmin || false;
}

export async function POST(req: Request) {
  try {
    if (!await isAdmin()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

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