import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { UserModel } from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ isAdmin: false });
    }

    await dbConnect();
    const user = await UserModel.findOne({ email });
    
    return NextResponse.json({ isAdmin: user?.isAdmin || false });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ isAdmin: false });
  }
} 