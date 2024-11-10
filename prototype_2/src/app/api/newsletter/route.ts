import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { NewsletterModel } from '@/models/Newsletter';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if email already exists
    const existingSubscriber = await NewsletterModel.findOne({ email });
    if (existingSubscriber) {
      return NextResponse.json(
        { message: 'Email already subscribed' },
        { status: 400 }
      );
    }

    // Create new subscriber
    await NewsletterModel.create({ email });

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { message: 'Error subscribing to newsletter' },
      { status: 500 }
    );
  }
} 